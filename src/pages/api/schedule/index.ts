import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import mongoDB from 'database/mongoDB';

export default async function hanlder(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT' && req.method !== 'GET' && req.method !== 'DELETE' && req.method !== 'POST') {
    res.status(500).json({ result: false, error: 'Route not valid' });
    return;
  }

  const { client, db } = await mongoDB();
  const scheduleCollection = db.collection('schedule');

  if (req.method === 'POST') {
    const response = await scheduleCollection.insertOne(req.body);
    client.close();

    if (!response) {
      res.status(422).json({ result: false, error: '일정 등록을 실패했어요:(' });
      return;
    }

    res.status(200).json({ result: true, data: response });
  } else if (req.method === 'GET') {
    const { startAt, endAt, email } = req.query;
    const fromAt = +startAt;
    const toAt = +endAt;

    const response = await scheduleCollection
      .find({
        $or: [{ 'user.email': email }, { collaborators: { $elemMatch: { email } } }],
        $nor: [{ fromDate: { $gt: toAt } }, { toDate: { $lt: fromAt } }],
      })
      .sort({ fromDate: 1 })
      .toArray();
    client.close();

    if (!response) {
      res.status(422).json({ result: false, error: '일정 조회에 실패했어요:(' });
      return;
    }

    res.status(200).json({ result: true, data: response });
  } else if (req.method === 'PUT') {
    const { _id, ...restInfo } = req.body;
    const response = await scheduleCollection.updateOne({ _id: ObjectId(_id) }, { $set: restInfo });
    client.close();

    if (!response) {
      res.status(422).json({ result: false, error: '일정 수정에 실패했어요:(' });
      return;
    }

    res.status(200).json({ result: true, data: response });
  }
}
