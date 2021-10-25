const Modal = { 
                open(){
                //abrir modal
                //adicionar a class active ao modal
                document.querySelector('.modal-overlay')
                .classList.add('active')
               // alert('chamei o modal')
                //console.log('fdfdfdfdfdfdf')
            },
            close(){
                //fechar a  modal
                //Remover a class active do modal
                document.querySelector('.modal-overlay')
                .classList.remove('active')
            }
        }
        const Storage = {
            get(){
                return JSON.parse(localStorage.getItem("dev.finances:transaction")) || []
            },
            set(transaction){
                localStorage.setItem("dev.finances:transactions", JSON.stringify(transaction))
            }
        }
    
        const Transaction = {
            all: Storage.get(),
             /**  Substituir os dados do HTML PELOS DE JAVASCRIPT
      * eu preciso somar as entradas
      * depois eu preciso somar as saidas e remover das entradas o valor das saídas
      * assim, eu terei o total 
      */
            
            add(transaction){
                Transaction.all.push(transaction)
             App.Reload()
               // console.log(Transaction.all)
            },
            remove(index){
                Transaction.all.splice(index, 1)
                App.Reload()
            },

            incomes(){
                let income = 0
            //pegar todas as transacoes
            Transaction.all.forEach(transaction => {
            //verificar se a transacao é maior que zero
            if(transaction.amount > 0){
                //para cada transacao, se ela  for maior que zero
            //somar a uma variavel e retornar a variavel
            //income = income + transaction.amount;
            income += transaction.amount; 
            }
            })        
            return income;
            },
            expenses(){
                //somar saídas
                let expense = 0
                //pegar todas as transacoes
                Transaction.all.forEach(transaction => {//forEach significa para cada
                //verificar se a transacao é maior que zero
                if(transaction.amount < 0){
                    //para cada transacao, se ela  for menor que zero
                //somar a uma variavel e retornar a variavel
                //income = income + transaction.amount;
                expense += transaction.amount; 
                }})
                return expense
            },
            total(){
                   // entradas - saidas
                return Transaction.incomes() + Transaction.expenses();
                }
            }
//Substituir os dados do HTML com dados do js
      const DOM = {
          transactionsContainer: document.querySelector('#data-table tbody'),

          addTransaction(transaction, index){
              const tr = document.createElement('tr')
              tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)// PEGA OS DADOS EM HTML ATERADOS E JOGA DENTRO DO html
              tr.dataset.index = index
              

              DOM.transactionsContainer.appendChild(tr)
          },
          innerHTMLTransaction(transaction, index){
        const CSSclass = transaction.amount > 0 ? "income" : "expense"


        const amount = Utils.formatCurrency(transaction.amount)

          const html = `
             <td class="description">${transaction.description}</td>
             <td class="${CSSclass}">${amount}</td>
             <td class="date">${transaction.date}</td>
             <td>
              <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover Transação">
             </td>
            `
            return html
          },
          updateBalance(){
              document.getElementById('incomeDisplay')
              .innerHTML = Utils.formatCurrency(Transaction.incomes())
              document.getElementById('expenseDisplay')
              .innerHTML = Utils.formatCurrency(Transaction.expenses())
              document.getElementById('totalDisplay')
              .innerHTML = Utils.formatCurrency(Transaction.total())
          },
          clearTransactions(){
              DOM.transactionsContainer.innerHTML = ""
          }
      }
      const Utils = {
          formatAmount(value){
              value = Number(value.replace(/\,\./g, "")) * 100
            return value
          },
          formatDate(date){
            const splittedDate = date.split("-")
            return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
        },
          formatCurrency(value){
             const signal = Number(value) < 0 ? "-" : ""

             value = String(value).replace("/\D/g", "")///\D/g isso para usar o regex ou expressão regular
             
             value = Number(value) / 100
               
             value = value.toLocaleString("pt-BR", {
                 style: "currency",
                 currency:"BRL"
             })

             return signal + value
          }
      }
      const Form = {
          description: document.querySelector("input#description"),
          amount: document.querySelector("input#amount"),
          date: document.querySelector("input#date"),

          getValues(){
              return {
                description: Form.description.value, 
                amount:Form.amount.value,
                date:Form.date.value
            }//ao acessar o objeto [Form.getValues] eu tenho os valores do imput.
                
              },
          
          validateFields(){// tirar os valores de dentro do objeto da função getValues de duas formas:
            const {description, amount, date} = Form.getValues()
            console.log(description)
             if(description.trim() === "" || amount.trim() === "" || date.trim() === ""){
                 throw new Error("Por Favor, preencha todos os campos") 
             }
            },
                //.trim significa limpeza de espaço vazio
            
           //const description = Form.getValues().description
            //const amount = Form.getValues().amount
            //const date = Form.getValues().date
            //console.log( Form.getValues())
            formatValues(){
                let {description, amount, date} = Form.getValues()
                amount = Utils.formatAmount(amount)
                date = Utils.formatDate(date)
    
                return{
                    description,
                    amount,
                    date
                }
               
              },
         
           clearFields(){
           Form.description.value = ""
           Form.amount.value = ""
           Form.date.value = ""
          },
          submit(event){
            event.preventDefault()//não siga o comportamento padrão
           
           // Form.formatData()
           try {
            Form.validateFields()
            //verificar se todas as informações foram preenchidas
            const transaction = Form.formatValues()
            //formatar os dados para salvar o 
            Transaction.add(transaction)
            //salvar
            Form.clearFields()
            //apagar os dados do formulário
            Modal.close()
            //modal feche 
                     
           } catch (error) {
               alert(error.message)

           }
                
            
          }
      }


      const App = {
         init() {
          
            Transaction.all.forEach((transaction, index) => {
                DOM.addTransaction(transaction, index)
            })
            DOM.updateBalance()
           
            Storage.set(Transaction.all)
            
         },
          Reload(){
            DOM.clearTransactions()
            App.init()
          },
        
    }
App.init()




