
// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    World = Matter.Composite;


const cells = 5;
const width = 600;
const height= 600;
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


console.log(horizantals);
console.log(verticals);