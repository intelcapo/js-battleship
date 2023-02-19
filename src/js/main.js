const COLUMNS = [1,2,3,4,5,6,7,8,9,10]
const ROWS = ['A','B','C','D','E','F','G','H','I','J']
const SMALL_SIZE = 2
const MEDIUM_SIZE = 3
const LARGE_SIZE = 4
const EXTRA_LARGE = 5

class ShipType {
    constructor(name,size,icon){
        this.name = name
        this.size = size
        this.icon = icon
    }
}

class Ship {
    constructor(type, direction){
        this.type = type
        this.direction = direction
    }
}

class ShipsCoordinates {
    constructor(shipName, coordinate){
        this.shipName = shipName
        this.coordinate = coordinate
    }
}

class RandomCoordinate {
    constructor(x,y){
        this.x = x
        this.y = y
    }
}

let tableShipTypes =  null
let tablePlayer = null
let tablePlayerForAttack = null
let tableEnemy = null
let tableEnemyForAttack = null

const SHIP_TYPES = [
    new ShipType('mineswipper',SMALL_SIZE,'🚤'),
    new ShipType('frigate',MEDIUM_SIZE,'🚢'),
    new ShipType('submarine',MEDIUM_SIZE,'🐟'),
    new ShipType('battleship',LARGE_SIZE,'🛳'),
    new ShipType('air-crafter',EXTRA_LARGE,'✈'),
]


let playerCoordinates = []
let enemyCoordinates = []

initComponents = ()=>{
    let tableShipsContent = null      
    //Table shipTypes
    tableShipsContent = getTableShipTypes()
    tableShipTypes = document.getElementById('table-ship-types')
    tableShipTypes.innerHTML = tableShipsContent

    paintTablesForPlayer()
    paintTablesForEnemy()
   
}

const paintTablesForPlayer = () =>{
    let tableContentForLocateShips = null
    let tableContentForAttackShips = null

     //Table for position ships    
     tableContentForLocateShips = `${getTableHeaders()}${getTableRows(true)}`    
     tablePlayer = document.getElementById('table-player')
     tablePlayer.innerHTML = tableContentForLocateShips 
     addListenerToAssignCoordinates()
     //Player's table for attack
     tableContentForAttackShips = `${getTableHeaders()}${getTableRows()}`    
     tablePlayerForAttack = document.getElementById('table-player-for-attack')
     tablePlayerForAttack.innerHTML = tableContentForAttackShips
     addListenerToAttack()

}

const paintTablesForEnemy = () =>{
    let tableContentForLocateShips = null
    let tableContentForAttackShips = null

     //Table for position ships    
     tableContentForLocateShips = `${getTableHeaders()}${getTableRows(true, true)}`    
     tableEnemy = document.getElementById('table-enemy')
     tableEnemy.innerHTML = tableContentForLocateShips 
    
     //Player's table for attack
     tableContentForAttackShips = `${getTableHeaders()}${getTableRows(false, true)}`    
     tableEnemyForAttack = document.getElementById('table-enemy-for-attack')
     tableEnemyForAttack.innerHTML = tableContentForAttackShips
     

}

const getTableShipTypes= ()=>{
    let headers = `<thead><th>*</th><th>Ship</th><th>Representation</th><th>Direction</th><th>Coordinate</th>`
    let rows = `<tbody></tbody>`
    SHIP_TYPES.forEach(shipType =>{
        let rowToCreate = `<tr> 
            <td> <input type='radio' name='shipType' value='${shipType.name}' id='${shipType.name}'/> </td> <td> <label for='${shipType.name}'>${shipType.name}</label></td> <td><label for='${shipType.name}'>${getShipRepresentation(shipType)}</label></td> <td>${getSelectForDirection(shipType.name)}</td> <td></td> 
        </tr>`
        rows += rowToCreate
    })
    rows += `</tbody>`
    return `${headers}${rows}`
}

const getShipRepresentation =(shipType)=>{
    let representation = `<span class='${shipType.name}'>`
    let ships = ''
    for (let index = 0; index < shipType.size; index++) {
        ships += `${shipType.icon}`        
    }
    return `${representation}${ships}</span>`
}

const getTableHeaders = ()=>{
    let headers = `<thead><th></th>`
    COLUMNS.forEach(column => {
        let header = `<th>${column}</th>`
        headers += header
    })
    headers = `${headers}</thead>`
    return headers
}

const getTableRows = (isForLocateShips=false, isForEnemy=false) =>{
    let rows = `<tbody>`
    ROWS.forEach(rowToCreate =>{
        let row = `<tr><th>${rowToCreate}</th>`
        COLUMNS.forEach((columnToCreate) =>{
            row += `<td id='${isForEnemy?'enemy-':''}${isForEnemy&&isForLocateShips?'locate-':''}${columnToCreate}-${rowToCreate}' 
            class='coordinate coordinate-to-${isForLocateShips?'locate':'attack'}-${isForEnemy?'enemy':'player'}'>🌊</td>`
        })
        row = `${row}</tr>`
        rows += row
    })
    rows = `${rows}</tbody>`
    return rows
}

const addListenerToAssignCoordinates= ()=>{   
    let columnsToModify = document.querySelectorAll('.coordinate-to-locate-player') 
    columnsToModify.forEach(col =>{
        col.addEventListener('click',assignCoordinateToShip)
    })
}

const addListenerToAttack = ()=>{   
    let columnsToModify = document.querySelectorAll('.coordinate-to-attack-player') 
    columnsToModify.forEach(col =>{
        col.addEventListener('click',shotAMisile)
    })
}

const getSelectForDirection= (shipName)=>{
    let select = `
    <select id='direction-${shipName}'>
        <option value='horizontal'>Horizontal</option>
        <option value='vertical'>Vertical</option>
    </select>`
    return select
}

const assignCoordinateToShip = (event)=>{
    let shipTypesToLocate = document.getElementsByName('shipType')
    let shipToLocate = ''
    shipTypesToLocate.forEach(rdbShipType =>{
        if(rdbShipType.checked){
            shipToLocate = rdbShipType.value
            return
        }
    })

    if(!shipToLocate){
        alert('Please, check a ship to locate')
        return
    }
    paintShip(shipToLocate, event.target.id)
}

const shotAMisile = (event)=>{
    let coordinateToSearch = event.target.id
    let rowsForAttact = document.querySelectorAll('.coordinate-to-attack-player')
    let columnToModify = undefined

    rowsForAttact.forEach(col =>{
        if(col.id === coordinateToSearch){
            columnToModify = col
        }
    })

    if(isCoordinateIntoEnemyList(coordinateToSearch)){
        columnToModify.innerText ='🔥'
        columnToModify.classList.add('assert')
    }else{
        columnToModify.innerText ='💦'
        columnToModify.classList.add('lose')
    }

    generateRandomAttackFromEnemy() 
    
}

const generateRandomAttackFromEnemy = ()=>{
    let randomCoordinate = getRandomCoordinate()
    let randomCoordinateStr = `${randomCoordinate.x}-${randomCoordinate.y}`    
    let enemyColumnId = `enemy-${randomCoordinateStr}`
    let columnToModifyTableEnemy = document.getElementById(enemyColumnId)
    let playerColumnToModify = document.getElementById(randomCoordinateStr)  

    if(isCoordinateIntoPlayerList(randomCoordinateStr)){     
        columnToModifyTableEnemy.innerText ='🔥'   
        columnToModifyTableEnemy.classList.add('assert')
        playerColumnToModify.classList.add('assert')
    }else{
        columnToModifyTableEnemy.innerText ='💦'
        columnToModifyTableEnemy.classList.add('lose')
        playerColumnToModify.innerText ='💦'
        playerColumnToModify.classList.add('lose')
    }
}

const paintShip = (shipTypeName, coordinate)=>{
    let arrayCoordinate = coordinate.split('-')
    let coordinateX = arrayCoordinate[0]
    let coordinateY = arrayCoordinate[1]
    let direction = getDirectionForShip(shipTypeName)
    setShipIntoCoordinates(shipTypeName,direction, coordinateX, coordinateY)
}

const getDirectionForShip = (shipTypeName) => {
    let idToSearch = `direction-${shipTypeName}`
    let selectDirection = document.getElementById(idToSearch)
    return selectDirection.value
}

const setShipIntoCoordinates = (shipTypeName, direction,coordinateX, coordinateY) => {
    let shipType = SHIP_TYPES.find(ship => ship.name === shipTypeName)
    if(direction === 'horizontal'){
        setShipIntoCoordinatesX(shipType,coordinateX, coordinateY)
    }else{
        setShipIntoCoordinatesY(shipType,coordinateX, coordinateY)
    }
    setEnemyShipIntoCoordinates(shipType)
}

const setEnemyShipIntoCoordinates = (shipType)=>{
    let randomCoordinate = getRandomCoordinate()
    let randomDirection = getRandomDirection()

    if(randomDirection === 'horizontal'){
        setShipIntoCoordinatesX(shipType,randomCoordinate.x, randomCoordinate.y,true)
    }else{
        setShipIntoCoordinatesY(shipType,randomCoordinate.x, randomCoordinate.y,true)
    }
}

const getListOfCoordinatesInXAxis = (shipType, coordinateX, coordinateY) =>{
    let coordinates = getInitialAndFinalCoordinate(shipType,'horizontal', coordinateX, coordinateY)
    let initialCoordinate = coordinates[0]
    let finalCoordinate =  coordinates[1]   
    let indexRow = ROWS.findIndex(row => row === coordinateY)
    let posX = 0
    let posY = 0
    let coordinate = ''
    let listOfCoordinates = [] 
    for (let index = initialCoordinate; index < finalCoordinate; index++) {
        posX = COLUMNS[index - 1];
        posY = ROWS[indexRow];
        coordinate= `${posX}-${posY}`
        listOfCoordinates.push(coordinate)
    }
    return listOfCoordinates
}

const setShipIntoCoordinatesX = (shipType, coordinateX, coordinateY, isForEnemy = false) => {   
    let listOfCoordinates = []
    listOfCoordinates = getListOfCoordinatesInXAxis(shipType, coordinateX, coordinateY)
    if(isForEnemy){
        while(!areValidCoordinatesForEnemy(shipType.name,listOfCoordinates)){
            let randomCoordinate = getRandomCoordinate()            
            listOfCoordinates = getListOfCoordinatesInXAxis(shipType, randomCoordinate.x, randomCoordinate.y)
        }
        console.log(listOfCoordinates)
        listOfCoordinates.forEach(coordinateXY =>{
            setShipIntoEnemyTable(shipType, coordinateXY)
        })    
    }else{
        if(areValidCoordinatesForPlayer(shipType.name,listOfCoordinates)){
            listOfCoordinates.forEach(coordinateXY =>{
                setShipIntoTable(shipType, coordinateXY)
            })
        }
    }
   
}

const getListOfCoordiantesInAxisY = (shipType, coordinateX, coordinateY) =>{
    let coordinates = getInitialAndFinalCoordinate(shipType,'vertical', coordinateX, coordinateY)
    let initialCoordinate = coordinates[0]
    let finalCoordinate =  coordinates[1]
    let posX = 0
    let posY = ''
    let coordinate = ''  
    let listOfCoordinates = [] 
    for (let indexY = initialCoordinate; indexY <= finalCoordinate; indexY++) {
        posX = COLUMNS[coordinateX - 1];
        posY = ROWS[indexY]
        coordinate= `${posX}-${posY}`
        listOfCoordinates.push(coordinate)
    }
    return listOfCoordinates
}

const setShipIntoCoordinatesY = (shipType, coordinateX, coordinateY, isForEnemy = false) => {
    let listOfCoordinates = []
    listOfCoordinates = getListOfCoordiantesInAxisY(shipType, coordinateX, coordinateY)
    if(isForEnemy){
        while(!areValidCoordinatesForEnemy(shipType.name,listOfCoordinates)){
            let randomCoordinate = getRandomCoordinate()            
            listOfCoordinates = getListOfCoordiantesInAxisY(shipType, randomCoordinate.x, randomCoordinate.y)
        }
        console.log(listOfCoordinates)
        listOfCoordinates.forEach(coordinateXY =>{
            setShipIntoEnemyTable(shipType, coordinateXY)
        })     
    }else{   
        if(areValidCoordinatesForPlayer(shipType.name,listOfCoordinates)){
            listOfCoordinates.forEach(coordinateXY =>{
                setShipIntoTable(shipType, coordinateXY)
            })        
        }
    }
}

const areValidCoordinatesForPlayer = (shipName, listOfCoordinates)=>{
    let areValid = true
    listOfCoordinates.forEach(coordinateXY =>{
        if(isCoordinateIntoPlayerList(coordinateXY)){   
            alert(`You cannot set the coordinate ${coordinateXY} to the shiptype: ${shipName}. Because this coordinate already exists for another ship`)
            areValid = false         
            return
        }
    })
    return areValid
}

const areValidCoordinatesForEnemy = (shipName, listOfCoordinates)=>{
    let areValid = true
    listOfCoordinates.forEach(coordinateXY =>{
        if(isCoordinateIntoEnemyList(coordinateXY)){   
            console.warn(`You cannot set the coordinate ${coordinateXY} to the shiptype: ${shipName}. Because this coordinate already exists for another ship`)
            areValid = false         
            return
        }
    })
    return areValid
}

const setShipIntoTable = (shipType, coordinate) =>{
    let playerCoordinate = new ShipsCoordinates(shipType.name, coordinate)
    playerCoordinates.push(playerCoordinate)
    let coordinateToPaint  = undefined       
    coordinateToPaint = document.getElementById(coordinate)     
    coordinateToPaint.innerText =  `${shipType.icon}`   
    coordinateToPaint.classList.add(shipType.name)    
}

const setShipIntoEnemyTable = (shipType, coordinate) =>{
    let enemyCoordinate = new ShipsCoordinates(shipType.name, coordinate)
    enemyCoordinates.push(enemyCoordinate)
    coordinate = `enemy-locate-${coordinate}`
    let coordinateToPaint  = undefined       
    coordinateToPaint = document.getElementById(coordinate)     
    coordinateToPaint.innerText =  `${shipType.icon}`   
    coordinateToPaint.classList.add(shipType.name)    
}

const isCoordinateIntoPlayerList = (coordinate) =>{
    let isCoordinateSaved = false
    let playerCoordinate = playerCoordinates.find(shipCoordinate => shipCoordinate.coordinate === coordinate)
    if(playerCoordinate){
        isCoordinateSaved = true        
    }else{
        isCoordinateSaved = false        
    }
    return isCoordinateSaved
}

const isCoordinateIntoEnemyList = (coordinate) =>{
    let isCoordinateSaved = false
    let enemyCoordinate = enemyCoordinates.find(shipCoordinate => shipCoordinate.coordinate === coordinate)
    if(enemyCoordinate){
        isCoordinateSaved = true        
    }else{
        isCoordinateSaved = false        
    }
    return isCoordinateSaved
}

const getInitialAndFinalCoordinate = (shipType,direction, coordinateX, coordinateY) => {
    let initialCoordinate = 0
    let finalCoordinate = 0

    if(direction === 'horizontal'){
        initialCoordinate = coordinateX
        finalCoordinate = parseInt(coordinateX) + parseInt(shipType.size)

        if(coordinateX == COLUMNS.length){            
            initialCoordinate =  (parseInt(coordinateX) -  parseInt(shipType.size))+ 1
            finalCoordinate =  (parseInt(finalCoordinate) -  parseInt(shipType.size)) + 1
        }else if(finalCoordinate > COLUMNS.length){
            let columnsToReduce = finalCoordinate - COLUMNS.length
            finalCoordinate =  COLUMNS.length + 1
            initialCoordinate = (coordinateX - columnsToReduce)+1
        }
    }else if (direction === 'vertical'){
        let indexRow = ROWS.findIndex(row => row === coordinateY) 
        initialCoordinate = ROWS.findIndex(row => row === coordinateY) 
        finalCoordinate = (parseInt(initialCoordinate) + parseInt(shipType.size)) -1
        if((indexRow +1)== ROWS.length){            
            initialCoordinate =  (parseInt(indexRow) -  parseInt(shipType.size)) +1
            finalCoordinate =  (parseInt(finalCoordinate) -  parseInt(shipType.size)) +1
        }else if(finalCoordinate > ROWS.length){
            let columnsToReduce = finalCoordinate - ROWS.length
            finalCoordinate =  ROWS.length - 1
            initialCoordinate = indexRow - columnsToReduce -1
        }
    }    
    return [initialCoordinate,finalCoordinate]
}

const getRandomCoordinate = () =>{
    let rowsRandomIndex = getRandomNumber(0,ROWS.length - 1)
    let columnsRandomIndex = getRandomNumber(0,ROWS.length - 1)
    let randomCoordinate = new RandomCoordinate(COLUMNS[columnsRandomIndex], ROWS[rowsRandomIndex])
    console.log(randomCoordinate)
    return randomCoordinate
}

const getRandomDirection = ()=>{
    let randomNumberDirection = getRandomNumber(0,2)
    return randomNumberDirection === 1 ? 'horizontal' : 'vertical'
}

const getRandomNumber = (min,max) =>{
    return Math.floor( Math.random() * (max - min) + min )
}

window.addEventListener('load',initComponents)

/**
 * TODO:: Implement damage inform
 * implement save the attacks to generate diferents coordnates
 */