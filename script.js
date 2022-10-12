function RPNTests(expr){
    if(expr==''){
        return "Поле ввода пустое!";
    }
    var separators = ['+', '-', '*', '/', ')','('];
    expr=expr.replace(/ /g,'');// удаление всех пробелов
  var probelexpr="";
  flag=true;
  for(var i=0;i<expr.length;i++)//цикл для установки пробелов перед и после каждого знака
  {
     flag=true;
     for(var j=0;j<separators.length;j++)
     {
        if(expr[i]==separators[j])
        {
            if(expr[i+1]==separators[j]){
                probelexpr += " " + expr[i];
            }else{
                probelexpr += " " + expr[i] + " ";
            }
            
            flag=false;         
        }
     }
     if(flag)
     {
        probelexpr +=expr[i];
     }
    }

    let stack = probelexpr.trim().split(' ');//делаем массив из строки по пробелам
    if(stack[0]== ''){//узнаём есть ли лишний пробел в начале
        stack.splice(0, 1);
    }

    for(let i=0; i<=stack.length-1; i++){//удаляем лишние пробелы и пустые значения
        if(stack[i]==' ' || stack[i]==''){
            stack.splice(i, 1);
        }
    }

    if (stack[0] == '-'){//ставим 0 перед "-" если это "0" элемент
        stack.splice(2, 0, ")");
        stack.splice(0, 0, "(","0");
    }
    
    let regul = ['+', '-', '*', '/']

    for(let i=stack.length-1; i>=0; i--){//узнаём где есть "(-" чтобы поставить между ними "0" в следующим цикле(во избежании глюка с бесконечным циклом их 2)
         if(stack[i]=='(' && stack[i+1]=='-'){
            stack.splice(i+3, 0,")");
            stack.splice(i+1, 0,"(","0"); 
         }
    }
   

    let skobki=0;
    for(let i=0; i<=stack.length-1;i++){//узнаём есть ли скобок
        if(stack[i]=='('){
            skobki+=1;
        }
        if(stack[i]==')'){
            skobki-=1;
        }
    }

    if(skobki!= 0 ){//проверка на незакрытые или не открытые скобки
            
        return "ERROR! Присутствует не закрытая или не открытая скобка";
    }

    stack.unshift('(');
    stack.push(')');
    return Raschot(stack);
}



function Raschot(arr){//функция преобразования к выражению записанному в обратной польской нотации.
    let arrres=[];//массив для записи в виде обратной польской нотации
    let dopstek=[];//дополнительный массив для символов

    for(let i=0; i<=arr.length-1;i++){
        
        if(arr[i]!='+' && arr[i]!='(' && arr[i]!=')' && arr[i]!='-' && arr[i]!='*' && arr[i]!='/'){//проверка на то, что это переменная
     
            if(dopstek[dopstek.length-1] != '*' || dopstek[dopstek.length-1] != '/' || arr[i+1] =='('){
                arrres.push(arr[i]); 
            }else{
                arrres.push( dopstek.pop(),arr[i]); 
            }
        }else{
            if(arr[i]==')'){
                let indent = 0;
                let jdi = undefined;
                for(let j=dopstek.length-1;j>=0;j--){//проверка на более приорететный симвл
                    if(dopstek[j]=='('){//проверка, чтобы сперва выполнялись действия в скобках
                        jdi = j;
                        break;
                    }else{
                        indent +=1;
                        if(dopstek[j]=='*' || dopstek[j]=='/'){
                            arrres.push(dopstek[j]);
                            dopstek.splice(j,1);   
                        }
                    }
                }
                for(let j=dopstek.length-1;j>=dopstek.length-1-indent;j--){// записываем остальные знаки с конца в конечный массив
                    arrres.push(dopstek.pop());
                }
                if(jdi != undefined){
                   dopstek.splice(jdi,1); 
                }
            }else{
                if(arr[i] != '' || arr[i] !=' ' || arr[i] != undefined || arr[i] != null){//проверка количества скобок в доп массиве для последующего 
                    let podschskobvds =1;                                                 // добавления "важных" символов("*","/") в нужную позицию
                    for(let j=dopstek.length-1; j>=0;j--){
                        if(dopstek[j]=='('){
                            podschskobvds+=1;
                        }
                    }
                    if((arr[i]=='*' || arr[i]=='/')&& arr[i+2] !=')'&& arr[i+1] !='('){
                        arrres.push(arr[i+1],arr[i]); 
                        i+=1;
                    }else{
                        dopstek.push(arr[i]);
                    }
                }                
                
            }
        }
    }   
    //ниже идут проверки на лишнее и их удаление 
    for(let i =arrres.length-1; i>0;i--){
        if(arrres[i] == '' || arrres[i] == '(' || arrres[i] == ')' || arrres[i] ==' ' || arrres[i] == undefined || arrres[i] == null){
            arrres.splice(i,1);
        }
    }
    var filtered = arrres.filter(function (el) {
        return el != null;
      });
      
      return filtered.join(' ');
}


function MInpRPN(form) {//функция, вызываемая по кнопке рядом с рукописным вводом
    form.read1.value = RPNTests(form.input1.value);
}


function UnitTest(form){//функция, вызываемая по кнопке "Выполнить юнит тест"
    let res ='';
    let a ='-3*(-7-9*8)*8-6/(7+9)';
    let a1 = RPNTests(a);
    let b =['(','(','1','+','31','*','4',')','/','5',];
    let b1 = Raschot(b);
    let c ='((a*b + (-31)) * c / d';
    let c1 = RPNTests(c);
    if(a1 == '0 3 - 0 7 - * 9 8 * - 8 * 6 7 9 + / -'){
        res = 'true: ' +a+' равно ' +a1 +"\n"; 
    }else{
        res = 'false: ' +a+' не равно '+ a1 +"\n";
    }
    
    if(b1 == '1 31 4 * + 5 /'){
        res = res + 'true: (1 +31 * 4 ) / 5 равно '+ b1 +"\n"; 
    }else{
        res = res + 'false: (1 +31 * 4 ) / 5 не равно '+ b1 +"\n";
    }
    
    if(c1 == 'a b * 0 31 - + c * d /'){
        res = res +  'true: '+c+' равно '+ c1 + "\n"; 
    }else{
        res = res +  'false: '+c+' не равно '+ c1 + "\n";
    }

    form.read2.value = res;
}