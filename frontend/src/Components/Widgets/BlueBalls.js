import { useEffect, useRef, useState, useCallback } from 'react'
import { Engine, Render, Bodies, World, Runner } from 'matter-js'
import { HuePicker } from 'react-color'
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

function BlueBalls(props) {
    const scene = useRef()
    const isPressed = useRef(false)
    const engine = useRef(Engine.create())
    const cw = 300 
    const ch = 300 
    const [color, setColor] = useState({ hex: "#f50057" });

    function setupWorld() {
        World.add(engine.current.world, [
            Bodies.rectangle(cw / 2, -10, cw, 20, { isStatic: true }),
            Bodies.rectangle(-10, ch / 2, 20, ch, { isStatic: true }),
            Bodies.rectangle(cw / 2, ch + 10, cw, 20, { isStatic: true }),
            Bodies.rectangle(cw + 10, ch / 2, 20, ch, { isStatic: true })
        ])
    }

    useEffect(() => {
        const render = Render.create({
            element: scene.current,
            engine: engine.current,
            options: {
                width: cw,
                height: ch,
                wireframes: false,
                background: 'transparent'
            }
        })
        
        setupWorld();

        Runner.run(engine.current)
        //Engine.run(engine.current)
        Render.run(render)

        return () => {
            Render.stop(render)
            World.clear(engine.current.world)
            Engine.clear(engine.current)
            render.canvas.remove()
            render.canvas = null
            render.context = null
            render.textures = {}
        }
    }, [])

    const handleDown = () => {
        isPressed.current = true
    }

    const handleUp = () => {
        isPressed.current = false
    }

    const handleAddCircle = useCallback(e => {
        const elemOffset = e.target.getBoundingClientRect()

        if (isPressed.current) {
            const ball = Bodies.circle(
                e.clientX - elemOffset.left,
                e.clientY - elemOffset.top,
                10,
                {
                    mass: 10,
                    restitution: 0.9,
                    friction: 0.005,
                    render: {
                        fillStyle: color.hex
                    }
                })
            World.add(engine.current.world, [ball])
        }
    }, [color])

    function clearBalls() {
        World.clear(engine.current.world)
        Engine.clear(engine.current)
        setupWorld();
    }

    return (
        <Card>
            <CardContent>
                <Grid container
                    spacing={1}
                alignItems="flex-end">
                    <Grid item>
                        <Typography paragraph
                            color="textSecondary"  >
                            Click and drag!
                        </Typography>
                        <div
                            onMouseDown={handleDown}
                            onMouseUp={handleUp}
                            onMouseMove={(e) => { handleAddCircle(e) }}>
                            <div ref={scene} style={{ width: '100%', height: '100%' }} />
                        </div>
                        <HuePicker
                            width={cw}
                            color={color}
                            onChange={setColor}
                        />
                    </Grid>
                    <Grid item>
                      <Button onClick={clearBalls} variant="outlined">Clear</Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

export default BlueBalls