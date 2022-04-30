const {Engine,Render,Runner,Bodies,World,Body,Events} = Matter;
// module aliases


const cellsHorizontal = 4;
const cellsVertical = 3;
const width = window.innerWidth;
const height= window.innerHeight;

const unitLenghtX = width/cellsHorizontal;
const unitLenghtY = height/cellsVertical;

// create an engine
var engine = Engine.create();
engine.world.gravity.y = 0;
const {world} = engine;

// create a renderer
var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        wireframes: false,
        width: width,
        height:height
    }
});

// run the renderer
Render.run(render);
// run the engine
Runner.run(Runner.create(), engine);



const walls = [
    Bodies.rectangle(width/2,0,width,2,{isStatic: true}),
    Bodies.rectangle(width/2,height,width,2,{isStatic: true}),
    Bodies.rectangle(0,height/2,2,height,{isStatic: true}),
    Bodies.rectangle(width,height/2,2,height,{isStatic: true})
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
const grid = Array(cellsVertical)
    .fill(null) // if we used falase insted we had depended arrays, so we will use null and map
    .map(()=>Array(cellsHorizontal).fill(false)); //using map to make undepanded arrays

const verticals = Array(cellsVertical)
    .fill(null) 
    .map(()=>Array(cellsHorizontal-1).fill(false)); 

const horizantals =Array(cellsVertical-1)
.fill(null) 
.map(()=>Array(cellsHorizontal).fill(false)); 


const startRow = Math.floor(Math.random() * cellsVertical);
const startColumn = Math.floor(Math.random() * cellsHorizontal);

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
        if (nxetRow<0 || nxetRow >=cellsVertical || nextColumn<0 || nextColumn>=cellsHorizontal){
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
            coumnIndex * unitLenghtX + unitLenghtX/2,
            rowIndex*unitLenghtY + unitLenghtY,
            unitLenghtX,
            5,
            {
                label:'wall',
                isStatic:true,
                render:{
                    fillStyle:  'red'
                }
            }
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
            coumnIndex * unitLenghtX + unitLenghtX,
            rowIndex*unitLenghtY + unitLenghtY/2,
            5,
            unitLenghtY,
            {
                label:'wall',
                isStatic:true,
                render:{
                    fillStyle:  'red'
                }
            }
        );
        World.add(world,wall);
    });
});

//draw goal
const goal = Bodies.rectangle(
    width - unitLenghtX/2,
    height - unitLenghtY/2,
    unitLenghtY*.7,
    unitLenghtY*.7,
    {
        label: 'goal',
        isStatic: true,
        render:{
            fillStyle:  'green'
        }
    }
);

World.add(world,goal);

//draw ball
const ballRadius = Math.min(unitLenghtX,unitLenghtY)/4;
const ball = Bodies.circle(
    unitLenghtX/2,
    unitLenghtY/2,
    ballRadius,
    {
        label: 'ball',
        render:{
            fillStyle:  'blue'
        }
    }
);
World.add(world,ball);

document.addEventListener('keydown',event =>{
    const {x,y} = ball.velocity;
    
    if(event.keyCode===87){
        Body.setVelocity(ball,{x,y:y-2});
    }

    if(event.keyCode===68){
        Body.setVelocity(ball,{x:x+2,y:y});
    }

    if(event.keyCode===83){
        Body.setVelocity(ball,{x,y:y+2});
    }

    if(event.keyCode===65){
        Body.setVelocity(ball,{x:x-2,y:y});
    }
});

//win Condition

Events.on(engine,'collisionStart',event=>{
    event.pairs.forEach(collision =>{
        const labels = ['ball','goal'];

        if(labels.includes(collision.bodyA.label) 
        && labels.includes(collision.bodyB.label)){
            
            world.gravity.y = 1;
            world.bodies.forEach(body => {
                if(body.label ==='wall'){
                    Body.setStatic(body, false);
                    document.querySelector(".winner").classList.remove('hidden');
                }
            })
        }
    });

});