import { Button, Card, CardActions, CardContent, CardHeader, Container, Typography } from '@material-ui/core';
import React, { useRef, useEffect, useState } from 'react';
import { MagicMirror } from '../../MagicMirror';
import { DocModalWithButton, UIExampleScope } from '../../Widgets/Docs';
import { JSMirror } from '../../Widgets/Educational';
import CloseUIButton from '../../WorldWidgets/CloseUIButton';

function Example(props){

    return (<Card elevation={4} style={{marginBottom: 20}}>
        <CardContent>
            {props.children}
        </CardContent>
    </Card>)
}

function MagicMirrorWithEnterWorld(props){

    return(<MagicMirror code={props.code} additionalButtons={[<CloseUIButton/>]}/>)
}

function Slide1(props){

    return (<>
        <Typography variant="h3">Intro</Typography>
        <ul>
            <li>Who We Are: ThoughtSTEM/coding education</li>
            <li>Graphic of React -- Racket -- Unreal architecture</li>
            <li>Looking for collaborators, funding, etc.</li>
        </ul>
    </>
    )
}
function Slide2(props){

    return(<>
        <Typography variant="h3">History of CodeSpells</Typography>
        <ul>
            <li>Graduate Research of CodeSpells prototype</li>
            <li>Kickstarter for CodeSpells -> Game on Steam</li>
            <li>COVID version</li>
        </ul>
    </>
    )
}

function Slide3(props){

    return(<>
        <Typography variant="h3">Related Work</Typography>
        <ul>
            <li>Visual Syntax</li>
            <li>Simulation/Multi-Agent Systems</li>
            <li>Games Research</li>
            <li>Education</li>
        </ul>
    </>
    )
}
function Slide4(props){

    return(<>
        <Typography variant="h3">Basic Racket Evaluation</Typography>
        <Example><MagicMirrorWithEnterWorld code={`;Racket evaluation
(list (+ 4 5) 
      (string-append \"Hello \" \"World\") 
      (and #t #f))`} /></Example>
        <Example><MagicMirrorWithEnterWorld code={`;The full #lang racket is available
;Error messages work too
(define (fib n)
  (if (< n 2)
      1
      (+ (fib (sub1 n)) 
         (fib ((compose sub1 sub1) n))))

(map fib (range 0 5))`} /></Example>
        <Example><MagicMirrorWithEnterWorld code={`;But let's do something in Unreal now...
(build (sphere 1000))`} /></Example>
         <Example><MagicMirrorWithEnterWorld code={`;We modeled the 3D API after 2htdp/image
(define s (sphere 1000)) 

(build (above s s))`} /></Example>
         <Example><MagicMirrorWithEnterWorld code={`;We've made some changes to make it work in 3D
(define s (sphere 1000))

(build 
  (above s 
    (beside/wide s s)))`} /></Example>
         <Example><MagicMirrorWithEnterWorld code={`;Let's do something fancy!
(define s (sphere 200))

(define (triangle s)
  (above s 
    (beside/wide s s)))

(define (foo n s) 
  (define f 
    (apply compose 
           (map (thunk* triangle) 
                (range n))))
  (f s))

(build (foo 3 s))`} /></Example>
         <Example><MagicMirrorWithEnterWorld code={`;Libraries for more advanced builders...
(build (room 2000 1000 600))`} /></Example>
    </>
    )
}
function Slide5(props){

    return(<>
        <Typography variant="h3">Events</Typography>
        <Typography variant="h5">Projectiles</Typography>
         <Example><MagicMirrorWithEnterWorld code={`;on-projectile-hit lets us subscribe functions to events
(clear-projectile-functions)

(on-projectile-hit 
  (lambda (location) 
    (build (room 1000 1000 600) 
           ;location where projectile landed
           ;but is it where we want the room to be?
           location)))`} /></Example>
         <Example><MagicMirrorWithEnterWorld code={`;variables get stored between projectile hits!
(clear-projectile-functions)

(define size 100)

(on-projectile-hit 
  (lambda (location) 
    (set! size (+ size 100))
    (when (> size 1000)
      (set! size 100))
    (build (sphere size 'air) 
           location)))`} /></Example>
        <Typography variant="h5">Trigger Zones</Typography>
         <Example><MagicMirrorWithEnterWorld code={`;trigger zones!
(clear-zone-enter-functions)

(on-zone-enter 
  (lambda (event) 
    (build (room 1000 1000 600) 
           (event-location event))))`} /></Example>
         <Example><MagicMirrorWithEnterWorld code={`;trigger zones!
(clear-zone-enter-functions)
(clear-projectile-functions)

(on-projectile-hit
  (lambda (e)
    (spawn (zone #:name "Trap")
           (event-location e))))

(on-zone-enter 
  (lambda (e) 
    (when (string=? (event-name e) "Trap")
      (build (room 1000 1000 600) 
             (event-location e)))))`} /></Example>
    </>
    )
}
function Slide6(props){

    return(<>
        <Typography variant="h3">Compiler</Typography>
         <Example><JSMirror scope={UIExampleScope} code={`//Sometimes code is tedious to write by hand...

(props)=>{
const [magicCode, setMagicCode] = React.useState("")
const [roomUICode, setRoomUICode] = React.useState("")
return <>
  <RoomUI wrapper={false} onCompile={(code)=>{setRoomUICode(code)}}/>
  <MagicMirror onChange={(editor, data, value)=>{setMagicCode(value)}}/>
  <MagicMirror code={magicCode.replace(/\(identity .*\)/, \`(identity ${roomUICode})\`)}/>
</>}`} /></Example>
    </>
    )
}

function Slide7(props){

    return(<>
        <Typography variant="h3">History of CodeSpells</Typography>
        <ul>
            <li>Graduate Research of CodeSpells prototype</li>
            <li>Kickstarter for CodeSpells -> Game on Steam</li>
            <li>COVID version</li>
        </ul>
    </>
    )
}
function Slide8(props){

    return(<>
        <Typography variant="h3">History of CodeSpells</Typography>
        <ul>
            <li>Graduate Research of CodeSpells prototype</li>
            <li>Kickstarter for CodeSpells -> Game on Steam</li>
            <li>COVID version</li>
        </ul>
    </>
    )
}

export default function RacketCon (props){
    const [currentSlide, setCurrentSlide] = useState(0);

    let slides = [<Slide1 />,
        <Slide2 />,
        <Slide3 />,
        <Slide4 />,
        <Slide5 />,
        <Slide6 />,
        <Slide7 />,
        <Slide8 />,
    ]

    useEffect(() => {
        document.body.style.setProperty("background-color", "transparent", "important");
    }, [])

    return (<>
        <Container style={{ float: "left", padding: 5 }} maxWidth="sm">
            <div style={{ padding: 10 }}>
                <Card>
                    <CardHeader
                        title={"RacketCon Talk"}
                        subheader={"Racket + React + Unreal = CodeSpells"}
                        action={<DocModalWithButton/>}>
                    </CardHeader>
                    <CardContent>
                        {slides[currentSlide]}
                    </CardContent>
                    <CardActions>
                        {currentSlide == 0 ? "" : <Button key="back-button" color="secondary"
                            onClick={() => {
                                setCurrentSlide(currentSlide - 1);
                            }}>Back</Button>}
                        {currentSlide < slides.length - 1 ?
                            <Button color="secondary" style={{ marginLeft: "auto" }}
                                key="continue-button" onClick={() => setCurrentSlide(currentSlide + 1)}>
                                Next
                            </Button>
                            : ""}
                    </CardActions>
                </Card>
            </div>
        </Container>
    </>)
}