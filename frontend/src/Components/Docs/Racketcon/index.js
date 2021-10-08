import { Button, Card, CardActions, CardContent, CardHeader, Container, Typography } from '@material-ui/core';
import React, { useRef, useEffect, useState } from 'react';
import { MagicMirror } from '../../MagicMirror';
import { DocModalWithButton, UIExampleScope } from '../../Widgets/Docs';
import { JSMirror } from '../../Widgets/Educational';
import CloseUIButton from '../../WorldWidgets/CloseUIButton';
import { useLocalStorage } from '../../../Util';

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

function Slide5(props) {

    return (<>
        <Typography variant="h3">Events</Typography>
        <Typography variant="h5">Projectiles</Typography>
        <Example><MagicMirrorWithEnterWorld code={`;on-projectile-hit lets us subscribe functions to events
(clear-projectile-functions)

(on-projectile-hit 
  (lambda (e) 
    (build (room 1000 1000 600) 
           ;location where projectile landed
           ;but is it where we want the room to be?
           (event-location e))))`} /></Example>
        <Example><MagicMirrorWithEnterWorld code={`;variables get stored between projectile hits!
(clear-projectile-functions)

(define size 100)

(on-projectile-hit 
  (lambda (e) 
    (set! size (+ size 100))
    (when (> size 1000)
      (set! size 100))
    (build (sphere size 'air) 
           (event-location e))))`} /></Example>

        <Typography variant="h5">Trigger Zones</Typography>
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
<RoomUI />
`} /></Example>
         <Example><JSMirror scope={UIExampleScope} code={`//Blockly...
<BlocklyIDE height={400} blockIds={[]} />`,`<BlocklyIDE height={400} blockIds={[  
          {
            blockName: "build",
            inputs: ["builder","vec"],
            output: false,
            doParens: true,
            doBlockName: true,
            color: 230
          },
          {
            blockName: "sphere",
            inputs: ["radius #"],
            output: true,
            doParens: true,
            doBlockName: true,
            color: 230
          } ,
          {
            blockName: "vec",
            inputs: ["x #","y #","z #"],
            output: true,
            doParens: true,
            doBlockName: true,
            color: 230
          } ,
          {
            blockName: "#",
            takesUserInput: true,
            inputs: [""],
            output: "#",
            doParens: false,
            doBlockName: false,
            color: 80
          }
        ]}
        />
          `} /></Example>
         <Example><JSMirror scope={UIExampleScope} code={`//Conway's Game of Life...
<GameOfLife color={"purple"} />`, `(props)=> {
  const [cells, setCells] = React.useState([])
  
  return <>
    <p>Number of active cells: {cells.length}</p>
    <GameOfLife color={"purple"} setCells={setCells}/>
  </>}`, 
  `(props)=> {
  const [cells, setCells] = React.useState([])
  
  return <>
    <GameOfLife color={"purple"} setCells={setCells}/>
    <MagicMirror additionalButtons={[<CloseUIButton/>]} code={\`(build
 (overlay
  \${cells.map((c)=> \`(translate (vec 0 \${c.x * 500} \${-c.y * 500}) (sphere 250))\`).join("\\n")}
  ))\`} />    
  </>}`} /></Example>
         <Example><JSMirror scope={UIExampleScope} code={`//Sometimes code is tedious to write by hand...

(props)=>{
const [magicCode, setMagicCode] = React.useState("")
const [roomUICode, setRoomUICode] = React.useState("")
const [finalCode, setFinalCode] = React.useState("")

useEffect(()=>{
  let precompile = magicCode.replace(/\\(HOLE1 [^)]*\\)/, \`(HOLE1 \${roomUICode})\`)
  prettifyRacketCode(precompile, (c)=>{setFinalCode(c)})
  
  }, [roomUICode, magicCode])

return <>
  <RoomUI wrapper={false} onCompile={(code)=>{setRoomUICode(code)}}/>
  <MagicMirror onChange={(editor, data, value)=>{setMagicCode(value)}}/>
  <MagicMirror code={finalCode}/>
</>} `
      } /></Example>
    </>
    )
}

function Slide7(props){

    return(<>
        <Typography variant="h3">Tools for Building Educational Experiences</Typography>
         <Example><JSMirror scope={UIExampleScope} code={`//Here are some components that are useful for educational material
(props)=>{
const [next, setNext] = useState(false);

return(!next ?
  <>
    <Typography variant="h4">Let's Learn about Functions!</Typography>
    <SimpleVideoPlayer videoUrl={"https://codespells-org.s3.amazonaws.com/NexusVideos/e-2.5-smaller.ogv"} />
    <p style={{marginTop: 50}}>Let's test whether you understood the video.</p>
    <MultipleChoiceQuestion question={"Which of the following is a good definition of a pure function?"} answers={[
      { correct: true, 
        text: "A function that has no side effects.", 
        feedback: "Right on!" },
      { correct: false, 
        text: "Something that returns a value.", 
        feedback: "Wrong." },
      { correct: false, 
        text: "A function that is very clean.", 
        feedback: "Sorry, that's not quite right." },
    ]} onCorrect={()=>setNext(true)} buttonText="Submit"/>
  </>:
  <>
    <Typography variant="h4">Moving on!</Typography>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vitae est in lectus tempor aliquam a a quam. Mauris a purus tortor. Nulla dapibus sem et tellus mollis, eu congue urna venenatis. Integer fermentum ligula leo, quis vehicula sem lobortis nec. Donec libero augue, vestibulum a ultricies eu, sollicitudin et risus. Nullam elementum, leo eu ornare pharetra, elit arcu efficitur ipsum, vitae condimentum mauris nisi at tellus. </p>
    <SimpleVideoPlayer videoUrl={"https://codespells-org.s3.amazonaws.com/NexusVideos/e-2.4-smaller.ogv"} />
    <p style={{marginTop: 50}}>Note below, <tt>sphere</tt> is a pure function, but <tt>build</tt> is not!</p>
    <MagicMirror code="(build (sphere 1000))"/>
  </>)
}
`} /></Example>
        
    </>
    )
}

function Slide8(props) {

    return (<>
        <Typography variant="h3">Isn't this fun?</Typography>
        <Example><JSMirror scope={UIExampleScope} code={
`(props)=>{
  const [start, setStart] = React.useState(false)
  
  return start? 
  <>
    <p>This JSMirror creates another JSMirror that creates another JSMirror that creates a Button! How meta!</p>
    <JSMirror 
      code={\`<JSMirror code={"<JSMirror code={'<ChatBubble>You can change me in 3 places!</ChatBubble>'} />"}/>\`}/>
  </> : 
  <Button onClick={()=>{setStart(true)}}>
    Ready to get your mind blown?
    </Button>}` } /></Example>
    </>
    )
}

function Slide9(props) {
    return (<>
        <Typography variant="h3">Events + UI</Typography>
        <Example><MagicMirrorWithEnterWorld scope={UIExampleScope} code={
`
(clear-projectile-hit-functions)
(clear-zone-enter-functions)

(define i 0)

(on-projectile-hit
  (lambda (e)
    (set! i (add1 i))
    (spawn (zone #:name (~a "Zone" i))
           (event-location e))))`
      } />
      </Example>
        <Example><JSMirror scope={UIExampleScope} code={
`<EventLogger/>` } /></Example>

      <Example><JSMirror scope={UIExampleScope} code={`
<EventLogger
  component={(props)=>{
               return <CastButton 
                         code={\`
(build (sphere 300)
       (event-location \${props.data.racketResponse}))\`} />
                }}>
</EventLogger>`
      
      } /></Example>
    </>
    )
}

function Slide10(props) {
    return (<>
         <Example><JSMirror scope={UIExampleScope} code={`//Sometimes code is tedious to write by hand...

(props)=>{
const [magicCode, setMagicCode] = React.useState("")
const [roomUICode, setRoomUICode] = React.useState("")
const [finalCode, setFinalCode] = React.useState("")

useEffect(()=>{
  let precompile = magicCode.replace(/\\(HOLE1 [^)]*\\)/, \`(HOLE1 \${roomUICode})\`)
  prettifyRacketCode(precompile, (c)=>{setFinalCode(c)})
  
  }, [roomUICode, magicCode])

return <>
  <RoomUI wrapper={false} onCompile={(code)=>{setRoomUICode(code)}}/>
  <MagicMirror onChange={(editor, data, value)=>{setMagicCode(value)}}/>
  <MagicMirror code={finalCode}/>
  <hr/>
  <JSMirror code={\`<EventLogger type="zone-enter" lastEventOnly component={(props)=>{
     return props.data.response.name == "Library" ? <DocModalWithButton /> : <MagicMirror code=";Don't know what to do?  Go to the library!!" /> }} />\`}/>
</>} `
      } /></Example>
    </>
    )
}

function Slide11(props) {
    return (<>
    </>
    )
}

export default function RacketCon (props){
    const [currentSlide, setCurrentSlide] = useLocalStorage("racketcon-talk-slide",0);

    let slides = [<Slide1 />,
        <Slide2 />,
        <Slide3 />,
        <Slide4 />,
        <Slide5 />,
        <Slide6 />,
        <Slide7 />,
        <Slide8 />,
        <Slide9 />,
        <Slide10 />,
        <Slide11 />,
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