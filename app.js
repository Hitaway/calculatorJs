const readline = require("readline");

// Characters that define an expression
const number = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
const operator = ['-', '+', '*', '/']
const brackets = ['(', ')']
const other = [' ']

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var userInput = function() {
    rl.question("Expression: ", function(expression) {
        if (expression == "exit") {
            rl.close()
        } else {
            if (checkBrackets(expression) &&
                isValidCaracter(expression)) {
                console.log(calculateWithBrackets(splitExpressionInArray(expression)))
            } else {
                console.log("Invalid expression error")
            }
            userInput()
        }
    });
}

/**
 * Checks if the expression is valid for parentheses
 * @param { String } str
 * @return { Boolean }
 */
function checkBrackets(str){
    var depth = 0
    for (var i in str) {   
        if (str[i] == '(') {
            depth ++
        } else if (str[i] == ')') {
            depth --
        }  
        if (depth < 0) return false
    }
    if (depth > 0) return false
    return true
}

/**
 * Checks if the expression contains only valid characters declared in the constant
 * @param { String } str
 * @return { Boolean }
 */
function isValidCaracter(str) {
    let list = number.concat(operator, brackets, other)
    for (var i in str) {
        if (list.indexOf(str[i]) < 0) return false
    }
    return true
}

/**
 * Send custom request using fetch api
 * @param { String } n
 * @return { Boolean }
 */
function isNumber(n) { 
    return /^-?[\d.]+(?:e-?\d+)?$/.test(n)
}

/**
 * Cuts a string containing operator numbers and parentheses into an array
 * @param { String } n
 * @return { String[] }
 */
function splitExpressionInArray(str) {
    let res = []
    for (var i in str) {
        // If it is a number and the last push element is also a number, then the number has more than 2 characters
        if (number.indexOf(str[i]) >= 0 && isNumber(res[res.length-1])) {
            res[res.length-1] += str[i]
        } else if (number.indexOf(str[i]) >= 0) {
            res.push(str[i])            
        } else if (operator.indexOf(str[i]) >= 0 || brackets.indexOf(str[i]) >= 0) {
            res.push(str[i])
        }
    }
    return res
}

/**
 * Finds if an element of tab1 is contained in table 2
 * @param { String[] } array1
 * @param { String[] } array2
 * @return { Boolean }
 */
function findCommonElement(array1, array2) {
    for (let i = 0; i < array1.length; i++) {
        for (let j = 0; j < array2.length; j++) {
            if (array1[i] === array2[j]) return true
        }
    }
    return false
}

/**
 * Calculate the expression taking into account the priorities on the operators
 * @param { String[] } str
 * @return { String[] }
 */
function calculateExpression(str) {
    let i = 0
    while (findCommonElement(str, ['*','/'])) {
        switch (str[i]) {
            case '*':
                str[i] = parseInt(str[i-1]) * parseInt(str[i+1])
                str.splice(i-1,1)
                str.splice(i,1)
                i=0
                break
            case '/':
                if (str[i+1] === '0') return 'Impossible to divide by zero'
                str[i] = parseInt(str[i-1]) / parseInt(str[i+1])
                str.splice(i-1,1)
                str.splice(i,1)
                i=0
                break
        }
        i++
    }
    
    i = 0
    while (findCommonElement(str, ['-','+'])) {
        switch (str[i]) {
            case '-':
                str[i] = parseInt(str[i-1]) - parseInt(str[i+1])
                str.splice(i-1,1)
                str.splice(i,1)
                i=0
                break
            case '+':
                str[i] = parseInt(str[i-1]) + parseInt(str[i+1])
                str.splice(i-1,1)
                str.splice(i,1)
                i=0
                break
        }
        i++
    }
    
    return str
}

/**
 * Calculate the expression taking into account the brackets
 * @param { String[] } str
 * @return { String[] }
 */
function calculateWithBrackets(str) {
    for (let i = 0; i < str.length; i++) {
        if (str[i] === ')') {
            let tmp = []
            let x = i-1
            while (x > 0) {
                if (str[x] === '(') break;
                tmp.push(str[x])
                x--
            }
            str[x] = calculateExpression(tmp)[0];
            str.splice(x+1,i)
        }
    }
    return calculateExpression(str)
}

// Test and objective 1
// console.log(calculateExpression(splitExpressionInArray('3 + 4 + 10')))                                          // 17
// console.log(calculateExpression(splitExpressionInArray('3 - 2 + 10')))                                          // 11
// console.log(calculateExpression(splitExpressionInArray('3 * 2 + 10')))                                          // 16
// console.log(calculateExpression(splitExpressionInArray('3 * 2 / 4')))                                           // 1.5
// console.log(calculateExpression(splitExpressionInArray('30 * 10 + 500')))                                       // 800
// console.log(calculateExpression(splitExpressionInArray('1 * 2 - 10')))                                          // -8
// console.log(calculateExpression(splitExpressionInArray('2 / 0 + 4')))                                           // Erreur
// console.log(calculateExpression(splitExpressionInArray('10 * 2 / 10')))                                         // 2
// console.log(calculateExpression(splitExpressionInArray('10 * 2 / 10 * 100 / 3 + 5 * 3 - 10 * 4 + 4 - 22')))     // 23

// Test and objective 2
// console.log(calculateWithBrackets(splitExpressionInArray('3 - (2 + 10)')))          // -9
// console.log(calculateWithBrackets(splitExpressionInArray('3 * (2 + 10)')))          // 36
// console.log(calculateWithBrackets(splitExpressionInArray('(4 + 9) / (2 + 1)')))     // 4.33
// console.log(calculateWithBrackets(splitExpressionInArray('(21 + 14) * 2')))         // 70
// console.log(calculateWithBrackets(splitExpressionInArray('((21 + 14) + 3) * 2')))   // Failed to continue...
// console.log(calculateWithBrackets(splitExpressionInArray('(10-1)+4+(5-4)')))        // Failed to continue...

// main program
console.log("Valid operators are [0-9] and [+, -, *, /, ), (]")
console.log("(CTRL+C to exit the program)")
userInput()
