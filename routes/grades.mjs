import db from "../db/conn.mjs";
import express from 'express';
const router = express.Router();
import { ObjectId } from 'mongodb';


router.get('/:id', async (req, res) =>{
  const collection = await db.collection('grades')
  const query = {_id: new ObjectId(req.params.id)}
  const result = await collection.findOne(query)

  if(!result) res.send('result not found').status(404)
  else res.send(result).status(200)
})

router.get ('/student/:id', async(req, res) =>{
  const collection = await db.collection ('grades')
  const query = {student_id:Number(req.params.id)}
  let result = await collection.find(query).toArray()

  if(!result) res.send('result not found').status(404)
  else res.send(result).status(200)
})

router.get('/class/:id', async(req, res) =>{
  const collection = await db.collection('grades')
  const query = {class_id: Number(req.params.class_id)}
  let result = await collection.find(query).toArray()

  if(!result) res.send('result not found').status(404)
  else res.send(result).status(200)
})

router.get('/student/:id/clsaa/:id', async (req, res) =>{
  const collection = await db.collection('grades')
  const query = {student_id: Number(req.params.id), class_id: Number(req.params.id)}
  let result = await collection.find(query).toArray()

  if(!result) res.send('result not found').status(404)
  else res.send(result).status(200)
})

router.get('/class/:id', async (req, res) => {
  try {
    const collection = db.collection('grades');

    const aggregationPipeline = [
      {
        $match: { class_id: Number(req.params.id) } 
      },
      {
        $group: {
          _id: null, 
          avgScore: { $avg: '$scores.score' } 
        }
      }
    ];

    const result = await collection.aggregate(aggregationPipeline).toArray();

    if (result.length === 0) {
      res.status(404).send('No grades found for the specified class ID');
    } else {
      res.status(200).json(result[0]); 
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal server error');
  }
});

  router.get('/student/:id', async (req, res) => {
    try {
      const collection = await db.collection('grades');
  
      const aggregationPipeline = [
        {
          $match: { student_id: Number(req.params.id) } 
        },
        { 
          $group: {
            _id: null,
            studentAvg: { $avg: '$scores.score' } 
          }
        }
      ];
  
      const result = await collection.aggregate(aggregationPipeline).toArray();
  
      if (result.length === 0) {
        res.status(404).send('No grades found for the specified student ID');
      } else {
        res.status(200).json(result[0]); 
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal server error');
    }
  });
  
  router.post('/', async (req, res) =>{
    const collection = await db.collection('grades');
    const newDocument = req.body
    newDocument.date = new Date();
    let result = await collection.insertOne(newDocument).toArray();
    if(result.insertedCount === 1)
    res.send('Grade document created successfully').status(200)
   else res.send('failed to create grade document').status(500);
  })

  router.patch('/:score', async (req, res) =>{
    const collection = await db.collection('grades');
    const query = {score : req.params.score}
    const update = {
      $set: { score: req.params.score }
    }
   let result = collection.updateOne(query, update)
    
 
   if (result.modifiedCount === 0) {
    res.status(404).send('No documents updated');
  } else {
    res.status(200).send('Document updated successfully');
  }
});


router.patch('/class/:id', async (req, res) =>{
  const collection = await db.collection('grades');
  const query = {class_id: Number(req.params.id)}
  const update = {
    $set: { class_id: req.params.id }
  }
 let result = collection.updateOne(query, update)
  

 if (result.modifiedCount === 0) {
  res.status(404).send('No documents updated');
} else {
  res.status(200).send('Document updated successfully');
}
});

router.patch('/student/:id', async(req, res) =>{
  const collection = await db.collection(grades)
  const query = {student_id: Number(req.params.id)}
  const update = {$set:{ student_id: req.body.id}}
  let result = await collection.updateMany(query, update)

  if (result.modifiedCount === 0) {
    res.status(404).send('No documents updated');
  } else {
    res.status(200).send('Documents updated successfully');
  }
})





// using aggregator

router.get('/class/:id/learner/:id', async (req, res)=>{
 const collection = db.collection('grades')
 const aggregationPipeline = ([{
  $project: {
    _id: 0,
    class_id: 1,
    learner_id: 1,
    scoreAvg: { $avg: '$scores.score' }
  }
}]);
 let result = collection.aggregate(aggregationPipeline)
 if(!result) res.send(result).status(404)
 else res.send(result).status(200)
})

router.get('/class/:id/', async (req, res) => {
  try {
    const collection = await db.collection('grades');
    const aggregationPipeline = [
      {
        $match: { class_id: Number(req.params.id) }
      },
      {
        $skip: 80
      },
      {
        $limit: 200
      }
    ];

    const result = await collection.aggregate(aggregationPipeline).toArray();

    if (!result.length) {
      res.status(404).send('No matching grades found');
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal server error');
  }
});

router.get('/class/:id', async (req, res) => {
  try {
    const collection = db.collection('grades');
    const aggregationPipeline = [
      {
        $project: {
          _id: 0,
          class_id: 1,
          learner_id: 1,
          scoreAvg: { $avg: '$scores.score' }
        }
      },
      {
        $sort: { class_id: 1 }
      }
    ];

    const result = await collection.aggregate(aggregationPipeline).toArray();

    if (!result.length) {
      res.status(404).send('No matching grades found');
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal server error');
  }
});

 

















export default router;
