
// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    World = Matter.Composite;


const cells = 3;
const width = 600;
const height= 600;

const unitLenght = width/cells;

// create an engine
var engine = Engine.create();
const {world} = engine;

// create a renderer
var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        wireframes: true,
        width: width,
        height:height
    }
});

// run the renderer
Render.run(render);
// run the engine
Runner.run(Runner.create(), engine);



const walls = [
    Bodies.rectangle(width/2,0,width,40,{isStatic: true}),
    Bodies.rectangle(width/2,height,width,40,{isStatic: true}),
    Bodies.rectangle(0,height/2,40,height,{isStatic: true}),
    Bodies.rectangle(width,height/2,40,height,{isStatic: true})
]

// add all of the bodies to the world
World.add(world, walls);

//**************Maze generation******************
const shuffle = (arr)=>{
    let counter = arr.length;

    while (counter>0){
        const index = Math.floor(Math.random()*counter);
        counter--;
        
        const temp = arr[counter];
        arr[counter] = arr[index];
        arr[index] = temp; 
    }
    return arr;
}

//the grid keeps the squeres inside the maze, and a value if you visited or not
const grid = Array(cells)
    .fill(null) // if we used falase insted we had depended arrays, so we will use null and map
    .map(()=>Array(cells).fill(false)); //using map to make undepanded arrays

const verticals = Array(cells)
    .fill(null) 
    .map(()=>Array(cells-1).fill(false)); 

const horizantals =Array(cells-1)
.fill(null) 
.map(()=>Array(cells).fill(false)); 


const startRow = Math.floor(Math.random() * cells);
const startColumn = Math.floor(Math.random() * cells);

const stepThroughCell = (row,column)=>{
    //If I have visited the cell at [row,col] then return
    if(grid[row][column]
        ){
        return;
    }
    //Mark cell as being visited
    grid[row][column] = true;

    //Assemble randomly-orderd list of nighbors
    const nieghbors =shuffle([
        [row-1,column,'up'], 
        [row,column+1,'right'], 
        [row+1,column,'down'], 
        [row,column-1,'left'] 
    ]);
  
    
    //for each neighbor
    for(let nieghbor of nieghbors){
        const [nxetRow,nextColumn,diraction] = nieghbor;
    //see if that neighbor is out of bounds
        if (nxetRow<0 || nxetRow >=cells || nextColumn<0 || nextColumn>=cells){
            continue; //skips to next nieghbor
        }
    //if we have visited that nieghbor, continue to next neighbor
        if(grid[nxetRow][nextColumn]){
            continue;
        }
    //remove wall from either horizontal or vertical (depands on our walk)
        if (diraction==='left'){
            verticals[row][column-1] = true;

        }else if (diraction==='right'){
            verticals[row][column] = true;
        }else if (diraction==='up'){
            horizantals[row-1][column] = true;
        }else if (diraction==='down'){ 
            horizantals[row][column] = true;
        }
        //visit that next cell
        stepThroughCell(nxetRow,nextColumn);
    }
    
    
}
stepThroughCell(startRow,startColumn);


horizantals.forEach((row,rowIndex)=>{
    row.forEach((open,coumnIndex)=>{
        if(open){
            return;
        }
        const wall = Bodies.rectangle(
            coumnIndex * unitLenght + unitLenght/2,
            rowIndex*unitLenght + unitLenght,
            unitLenght,
            5,
            {isStatic:true}
        );
        World.add(world,wall);
    });
});

verticals.forEach((row,rowIndex)=>{
    row.forEach((open,coumnIndex)=>{
        if(open){
            return;
        }
        const wall = Bodies.rectangle(
            coumnIndex * unitLenght + unitLenght,
            rowIndex*unitLenght + unitLenght/2,
            5,
            unitLenght,
            {isStatic:true}
        );
        World.add(world,wall);
    });
});
