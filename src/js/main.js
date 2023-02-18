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

let tableShipTypes =  null
let tablePlayer = null



const SHIP_TYPES = [
    new ShipType('mineswipper',SMALL_SIZE,'🚤'),
    new ShipType('frigate',MEDIUM_SIZE,'🚢'),
    new ShipType('submarine',MEDIUM_SIZE,'🐟'),
    new ShipType('battleship',LARGE_SIZE,'🛳'),
    new ShipType('air-crafter',EXTRA_LARGE,'✈'),
]

initComponents = ()=>{
    let tableContent = null
    let tableShipsContent = null
    //Table shipTypes
    tableShipsContent = getTableShipTypes()
    tableShipTypes = document.getElementById('table-ship-types')
    tableShipTypes.innerHTML = tableShipsContent
    //Table for play
    tableContent = `${getTableHeaders()}${getTableRows()}`    
    tablePlayer = document.getElementById('table-player')
    tablePlayer.innerHTML = tableContent 

    addListenerToAssignCoordinates()
}

getTableShipTypes= ()=>{
    let headers = `<thead><th>*</th><th>Ship</th><th>Representation</th><th>Direction</th><th>Coordinate</th>`
    let rows = `<tbody></tbody>`
    SHIP_TYPES.forEach(shipType =>{
        let rowToCreate = `<tr> 
            <td> <input type='radio' name='shipType' value='${shipType.name}' id='${shipType.name}'/> </td> <td> <label for='${shipType.name}'>${shipType.name}</label></td> <td>${getShipRepresentation(shipType)}</td> <td>${getSelectForDirection(shipType.name)}</td> <td></td> 
        </tr>`
        rows += rowToCreate
    })
    rows += `</tbody>`
    return `${headers}${rows}`
}

getShipRepresentation =(shipType)=>{
    let representation = `<span class='${shipType.name}'>`
    let ships = ''
    for (let index = 0; index < shipType.size; index++) {
        ships += `${shipType.icon}`        
    }
    return `${representation}${ships}</span>`
}

getTableHeaders = ()=>{
    let headers = `<thead><th></th>`
    COLUMNS.forEach(column => {
        let header = `<th>${column}</th>`
        headers += header
    })
    headers = `${headers}</thead>`
    return headers
}


getTableRows = () =>{
    let rows = `<tbody>`
    ROWS.forEach(rowToCreate =>{
        let row = `<tr><th>${rowToCreate}</th>`
        COLUMNS.forEach((columnToCreate) =>{
            row += `<td id='${columnToCreate}-${rowToCreate}' class='coordinate'>🌊</td>`
        })
        row = `${row}</tr>`
        rows += row
    })
    rows = `${rows}</tbody>`
    return rows
}

addListenerToAssignCoordinates= ()=>{
    let columnsToModify = document.querySelectorAll('.coordinate')
    columnsToModify.forEach(col =>{
        col.addEventListener('click',assignCoordinateToShip)
    })
}

getSelectForDirection= (shipName)=>{
    let select = `
    <select id='direction-${shipName}'>
        <option value='horizontal'>Horizontal</option>
        <option value='vertical'>Vertical</option>
    </select>`
    return select
}

assignCoordinateToShip = (event)=>{
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
    console.log(shipToLocate)
    paintShip(shipToLocate, event.target.id)
}

paintShip = (shipTypeName, coordinate)=>{
    let arrayCoordinate = coordinate.split('-')
    let coordinateX = arrayCoordinate[0]
    let coordinateY = arrayCoordinate[1]
    let direction = getDirectionForShip(shipTypeName)

    console.log(arrayCoordinate)
    console.log(direction)

    setShipIntoCoordinates(shipTypeName,direction, coordinateX, coordinateY)
}

getDirectionForShip = (shipTypeName) => {
    let idToSearch = `direction-${shipTypeName}`
    let selectDirection = document.getElementById(idToSearch)
    return selectDirection.value
}


setShipIntoCoordinates = (shipTypeName, direction,coordinateX, coordinateY) => {
    let shipType = SHIP_TYPES.find(ship => ship.name === shipTypeName)
    if(direction === 'horizontal'){
        setShipIntoCoordinatesX(shipType,coordinateX, coordinateY)
    }else{

    }
}

setShipIntoCoordinatesX = (shipType, coordinateX, coordinateY) => {
    let coordinates = getInitialAndFinalCoordinate(shipType,'horizontal', coordinateX, coordinateY)
    let initialCoordinate = coordinates[0]
    let finalCoordinate =  coordinates[1]
    let coordinateToPaint  
    let indexRow = ROWS.findIndex(row => row === coordinateY)

    for (let index = initialCoordinate; index < finalCoordinate; index++) {
        let posX = COLUMNS[index - 1];
        let posY = ROWS[indexRow];
        let coordinate= `${posX}-${posY}`
        console.log(coordinate)
        coordinateToPaint = document.getElementById(coordinate) 
        console.log(coordinateToPaint)    
        coordinateToPaint.innerText =  `${shipType.icon}`   
        coordinateToPaint.classList.add(shipType.name)
    }
}

getInitialAndFinalCoordinate = (shipType,direction, coordinateX, coordinateY) => {
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
    }
   
    return [initialCoordinate,finalCoordinate]
}

selectCoordinate = (event)=>{
    event.target.innerText = '🔥'
}

window.addEventListener('load',initComponents)