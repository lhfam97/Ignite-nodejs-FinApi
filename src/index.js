const { request, response } = require('express');
const express = require('express');
const { v4: uuidv4 } = require('uuid')
const app = express();

app.use(express.json());

const customers = [];

/*
* cpf - string
* name - string
* id - uuid
* statement - []
*/

function verifyIfExistsAccountCPF(request,response,next){
  const {cpf} = request.params;

  const customer = customers.find(customer=> customer.cpf === cpf);

  if(!customer){
    return response.status(400).json({error: "Customer not found!"})
  }
  request.customer = customer;
  return next();
}

app.post('/account',(request,response)=>{
  const { cpf, name } = request.body;
  const customerAlreadyExists = customers.some(customer => customer.cpf===cpf);
  if(!customerAlreadyExists){

  customers.push({
    cpf,
    name,
    id: uuidv4(),
    statement: []
  });
  return response.status(201).send();
}
  return response.status(400).json({error: "Customer already exists!"});
})

app.get('/statement/:cpf',verifyIfExistsAccountCPF,(request,response)=>{
  const {customer} = request

  return response.json(customer.statement)

})

app.post('deposit',verifyIfExistsAccountCPF,(request,response)=>{
  const {description, amount} = request.body;

  const {customer} = request;

  const statementOperation = {
    description,
    amount,
    createdAt: new Date(),
    type: 'credit'
  }

  customer.statement.push(statementOperation);

  return response.status(201).send();
})

app.listen(3333,()=>{
  console.log("Server listening at port 3333");
})
