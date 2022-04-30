
// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    World = Matter.Composite;
    MouseConstraint = Matter.MouseConstraint;
    Mouse = Matter.Mouse;


const width = 800;
const height= 600;
// create an engine
var engine = Engine.create();
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

World.add(world,MouseConstraint.create(engine,{
    mouse: Mouse.create(render.canvas)
}));

const walls = [
    Bodies.rectangle(400,0,800,40,{isStatic: true}),
    Bodies.rectangle(400,600,800,40,{isStatic: true}),
    Bodies.rectangle(0,300,40,600,{isStatic: true}),
    Bodies.rectangle(800,300,40,600,{isStatic: true})
]

// add all of the bodies to the world
World.add(world, walls);

//random shapes
for (let i=0;i<30;i++){
    if (Math.random()>0.5){
        World.add(world, Bodies.rectangle(Math.random()*width,Math.random()*height,50,50) );
    }else{
        World.add(world, Bodies.circle(Math.random()*width,Math.random()*height,35,{
            render:{
                fillStyle: 'red'
            }
        }) );
    }
    
}
