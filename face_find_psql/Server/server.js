const express= require('express');
const bcrypt=require('bcrypt');
const cors=require('cors');
const knex=require('knex')

const app=express()

app.use(cors());
app.use(express.json());

const db=knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'ian',
      password : '',
      database : 'face_find'
    }
  });

db.select('*').from('users')

app.get('/',(req,res)=>{
    res.send('face_find app on port 3001');
})


app.post('/register',(req,res)=>{
    const { email, name, password } = req.body;
    const hash = bcrypt.hashSync(password,10);
    
    db.transaction(trx=>{
        trx.insert({
            hash:hash,
            email:email
        }).into('login')
        .then(res=>
            trx.insert({
                name:name,
                email:email,
                joined:new Date()
            }).into('users')
        )
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .then(response=>res.json('succes'))
    .catch(err=> res.status(400).json('failed'))
})


app.post('/signin',(req,res)=>{
    const {email,password}= req.body
    db.select('email','hash').from('login').where('email','=',email)
    .then(user=>{
        const ok = bcrypt.compareSync(password,user[0].hash)
        if (ok){
           return db.select('*').from('users').where('email','=',email)
            .then(user=>res.json(user[0]))
            .catch(err=>res.status(404).json('user not found'))
        }else{
            res.status(404).json('user not found')
        }
    })
    .catch(err=>res.status(400).json('error bad request'))
})



app.get('/profile/:id',(req,res)=>{
    const { id } = req.params
    db.select('*').from('users').where({id})
       .then(user =>{
        if(user.length){
            res.json(user[0])
        }else{
            res.status(404).json('user not found');
        }
            
       })
        .catch(err=>{
            res.status(404).json('error request');
        })
})


app.put('/image',(req,res)=>{
    const { id } = req.body
    db('users').where('id','=', id )
    .increment('entries',1)
    .returning('entries')
    .then(entries=>{
        res.json(entries[0].entries);
    })
    .catch(err=>res.status(400).json('bad request'))
 });




app.listen(3000,()=>{
    console.log('server on port 3000');
})
