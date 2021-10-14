import { Button, Card, CardActions, CardContent, CardHeader, Container, Fade, Typography } from '@material-ui/core';
import React, { useRef, useEffect, useState } from 'react';
import { MagicMirror } from '../../MagicMirror';
import { DocModal, DocModalWithButton } from '../../Widgets/Docs';
import { BlocklyIDE, JSMirror } from '../../Widgets/Educational';
import CloseUIButton from '../../WorldWidgets/CloseUIButton';
import { useLocalStorage } from '../../../Util';
import { UIScope } from '../../WorldWidgets/UIScope';
import { ArchitecturalDiagram } from '../ArchitecturalDiagram';
import RoomUI from '../../WorldWidgets/RoomUI';
import DarkModeSwitch from '../../Widgets/DarkModeSwitch';
import { HamburgerMenu } from '../../WorldWidgets/Util';
import { prettifyRacketCode } from '../../WorldWidgets/Util';

UIScope.prettifyRacketCode = prettifyRacketCode;

function Example(props){

    return (<Card elevation={4} style={{marginBottom: 20}}>
        <CardContent>
            {props.children}
        </CardContent>
    </Card>)
}

function FadeInButton(props){
  const [shown, setShown] = useState(false)

  return (shown? <Fade in={true}><div>{props.children}</div></Fade>
  :<Button onClick={()=>setShown(true)}>{props.prompt}</Button>)
}

function MagicMirrorWithEnterWorld(props){

    return(<MagicMirror code={props.code} additionalButtons={[<CloseUIButton/>]}/>)
}

function Slide1(props){

  return (<>
    <DarkModeSwitch/>
    <Typography variant="h3">Intro</Typography>
    <FadeInButton prompt="Teaser: Summoning a Dragon">
    <p style={{ fontSize: 20 }}>As a teaser for what's to come, let's summon a dragon!</p>
    <MagicMirror code={`(define d (spawn (dragon)))

(sleep 5)

(spit-fire d 4)`} additionalButtons={[<CloseUIButton />]} /></FadeInButton>
    <ul style={{ fontSize: 20 }}>
      
      <li><FadeInButton prompt="Who are we?">Who are we?
          <ul>
            <li>Founded ThoughtSTEM in 2012 with goal of spreading computer science education</li>
            <li>Spent the last 9 years developing educational technologies</li>
            <li>Co-authored a book for computer science educators and students: <i>Don't Teach Coding: Until You Read This Book</i></li>
          </ul></FadeInButton>
      </li>
      <li><FadeInButton prompt="Who is this talk for?">Who is this talk for?
          <ul>
            <li>Anyone interested in: Racket, Unreal, React. CodeSpells integrates these three runtimes.</li>
            <li>Educators who want to show students the magic of coding.</li>
          <li>Potential collaborators
            <ul>
              <li>Want to write a paper with us?</li>
              <li>Want to use CodeSpells in your research or classroom?</li>
              <li>Want to fund us/hire us/financially support the project?</li>
            </ul>
          </li>
          </ul></FadeInButton>
      </li>
    </ul>
  </>
  )
}
function Slide2(props){

  return (<>
    <Typography variant="h3">History of CodeSpells</Typography>
    <img width={"100%"} style={{ paddingTop: 20 }} src="https://codespells.org/images/old-spellbook.jpeg" />
    <ul style={{ fontSize: 20 }}>
      <li><FadeInButton prompt="PhD Thesis">Started as an undergraduate project that turned into a PhD thesis
        <ul>
          <li><i>Three Paradigms for Mixing Coding and Games.</i> Dissertation. Stephen Foster.</li>
          <li><i>CodeSpells: embodying the metaphor of wizardry for programming.</i> ITiCSE '13. Sarah Esper, Stephen Foster, William Griswold.</li>
          <li><i>From competition to metacognition: designing diverse, sustainable educational games.</i> CHI '13. Stephen Foster, Sarah Esper, William Griswold.</li>
        </ul>
      </FadeInButton></li>
      <li><FadeInButton prompt="Kickstarter">Kickstarter for CodeSpells -> Game on Steam (2015)
        <img width={"100%"} style={{ paddingTop: 20 }} src="https://codespells.org/images/in-game4.jpg" />
        <img width={"100%"} style={{ paddingTop: 20 }} src="https://codespells.org/images/in-game-coding2.gif" /></FadeInButton></li>
      <li><FadeInButton prompt="Current Version">In 2020, we started a re-write of the project.
        <ul>
          <li>Uses modern technologies: Racket, React, and Unreal.</li>
          <li>More of a platform than a game.</li>
          <li>Returned to a focus on education, making a tool for educators.</li>
        </ul>
      </FadeInButton>
      </li>
    </ul>
  </>
  )
}

function Slide3(props){

    return(<>
        <Typography variant="h3">Related Work</Typography>
      <ul style={{ fontSize: 20 }}>
        <li><FadeInButton prompt="Visual Syntax">Visual Syntax: Mixing Code and UI
          <ul>
            <img width={"100%"} style={{ paddingTop: 20 }} src="https://codespells-org.s3.amazonaws.com/LivelitsPaperFigure.png" />
            <li><i>Filling Typed Holes with Live GUIs.</i> PLDI ’21. Cyrus Omar, David Moon, Andrew Blinn, Ian Voysey, Nick Collins, Ravi Chungh.</li>
            <img width={"100%"} style={{ paddingTop: 20 }} src="https://codespells-org.s3.amazonaws.com/VisualSyntaxFigure.png" />
            <li><i>Adding Interactive Visual Syntax to Textual Code.</i> OOPSLA '20. Lief Andersen, Michael Ballantyne, Matthias Felleisen.</li>
            <li>CodeSpells can be a platform for prototyping novel coding interfaces like these, using the rich React ecosystem.</li>
          </ul></FadeInButton>
        </li>
        <li><FadeInButton prompt="Simulation/Multi-Agent Systems">Simulation/Multi-Agent Systems
          <ul>
            <li>Well Known Results
              <ul>
                <li>Schelling's 1971 segregation models (see Parable of the Polygons.)</li>
                <li>Sugarscape</li></ul></li>
            <li>Netlogo is a multi-agent programmable modeling environment that has been used for building simulations in 2D environments.</li>
            <li>CodeSpells could be a test bed for simulations that run in 3D and use the power of the Unreal game engine.</li>
          </ul></FadeInButton>
        </li>
        <li><FadeInButton prompt="Games Research">Games Research
          <ul>
            <li>Gamification/Education</li>
            <li>Serious Games (FoldIt)</li>
            <li>VR-Based Interfaces</li>
            <li>CodeSpells is a VR-capable platform that can put anything in the Unreal ecosystem within reach of researchers.</li>
          </ul></FadeInButton>
        </li>
        <li><FadeInButton prompt="CS Education Research">CS Education Research
          <ul>
            <li>There are many open questions in this field.</li>
            <li>Prior CodeSpells research has shown that the metaphor of magic is an effective way to teach coding. <u>How can this metaphor best be leveraged?</u></li>
            <li>The Racket <i>How To Design Programs</i> philosophy teaches in the context of an increasingly interesting set of programming languages. <u>What interesting languages are possible in a 3D environment?</u></li>
            <li>There's much debate about whether text- or block-based programming is best for novices. <u>What about the under-explored middle ground that includes both?</u></li>
            <li>CodeSpells can be used to continue exploring these questions like these.</li>
          </ul></FadeInButton>
        </li>
      </ul>
    </>
    )
}
function Slide4(props){

    return(<>
        <Typography variant="h3">Basic Racket Evaluation</Typography>
        <p style={{fontSize: 20}}>
          For our first trick, basic Racket evaluation!
        </p>
        <Example><MagicMirrorWithEnterWorld code={`;Racket evaluation
(list (+ 4 5) 
      (string-append \"Hello \" \"World\") 
      (and #t #f))`} /></Example>
        <p style={{fontSize: 20}}>
          Let's think about what just happened there behind the curtain...
        </p>
      <ArchitecturalDiagram
        highlightedNodes={[{ id: "React", color: "red" }, { id: "Racket", color: "orange" }]}
        highlightedEdges={[{ id: "React-Racket", color: "red" }, {id: "Racket-React", color: "orange"}]} />
        <p style={{fontSize: 20}}>
          Let's do a more complex example: 
        </p>
        <Example><MagicMirrorWithEnterWorld code={`;The full #lang racket is available
;Error messages work too
(/ 3 0)
(define (fib n)
  (if (< n 2)
      1
      (+ (fib (sub1 n)) 
         (fib ((compose sub1 sub1) n)))))

(map fib (range 0 5))`} /></Example>
        <p style={{fontSize: 20}}>
          Let's use that cool 3D world back there behind the UI! 
        </p>
        <Example><MagicMirrorWithEnterWorld code={`;But let's do something in Unreal now...
(build (sphere 1000))`} /></Example>
      <ArchitecturalDiagram
        highlightedNodes={[{ id: "React", color: "red" }, { id: "Racket", color: "orange" }, {id: "Unreal", color: "yellow"}]}
        highlightedEdges={[{ id: "React-Racket", color: "red" }, {id: "Racket-React", color: "orange"}, {id: "Racket-Unreal", color: "orange"}]} />
        <p style={{fontSize: 20}}>
          Some of you may notice that our voxel-building API is similar to 2htdp/image or Pict3D: 
        </p>
         <Example><MagicMirrorWithEnterWorld code={`;We modeled the 3D API after 2htdp/image
(define s (sphere 1000)) 

(build (above s s))`} /></Example>
         <Example><MagicMirrorWithEnterWorld code={`;We've made some changes to make it work in 3D
(define s (sphere 1000))

(build 
  (above s 
    (beside/wide s s)))`} /></Example>
        <p style={{fontSize: 20}}>
          Voxels are very performant, so we can make very large superstructures. What will this next code example do? 
        </p>
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
        <p style={{fontSize: 20}}>
          We've built some more complicated builders, and we're looking for others to make more! 
        </p>
         <Example><MagicMirrorWithEnterWorld code={`;Let's build 2 rooms beside each other...
(build (room 2000 1000 600))`} /></Example>
        <p style={{fontSize: 20}}>
          There's lots more to come. But first, a quick break. 
        </p>
        <p style={{fontSize: 20}}>
          Did you notice that these interactive slides are like the coolest powerpoint you've seen? They're like Jupyter Notebooks, with an integrated 3D world! Wouldn't you want to use this for your classes?
        </p>
    </>
    )
}

function Slide5(props) {

    return (<>
        <Typography variant="h3">Events</Typography>
        <Typography variant="h5">Projectiles</Typography>
        <p style={{fontSize: 20}}>
          Let's write code to make projectiles do something interesting: 
        </p>
        <Example><MagicMirrorWithEnterWorld code={`;on-projectile-hit lets us subscribe functions to events
(clear-projectile-functions)

(on-projectile-hit 
  (lambda (e) 
    (build (room 1000 1000 600) 
           ;location where projectile landed
           ;but is it where we want the room to be?
           (event-location e))))`} /></Example>
        <p style={{fontSize: 20}}>
          The code above registers an event: 
        </p>
      <ArchitecturalDiagram
        highlightedNodes={[{ id: "React", color: "red" }, { id: "Racket", color: "orange" }]}
        highlightedEdges={[{ id: "React-Racket", color: "red" }, {id: "Racket-React", color: "orange"}]} />
        <p style={{fontSize: 20}}>
          Projectile is fired in Unreal, Racket runs your registered function, stuff builds in Unreal: 
        </p>
      <ArchitecturalDiagram
        highlightedNodes={[{ id: "Unreal", color: "red" }, { id: "Racket", color: "orange" }]}
        highlightedEdges={[{ id: "Racket-Unreal", color: "orange" }, {id: "Unreal-Racket", color: "red"}]} />
        <p style={{fontSize: 20}}>
          Racket can maintain state between events: 
        </p>
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
        <p style={{fontSize: 20}}>
          Let's see the same concept, but with a different kind of event! 
        </p>
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
        <p style={{fontSize: 20}}>
          Commercial break... If you think CodeSpells is looking kind of a like a game engine, you're not wrong! We want it to be a platform for people to build games, simulations, and other interactive experiences. 
        </p>
    </>
    )
}

function Slide6(props){

    return(<>
        <Typography variant="h3">Visual Syntax</Typography>
        <p style={{fontSize: 20}}>
          Compiling to S-expressions is easy.
        </p>
      <Example>
        <RoomUI />
      </Example>
      <Example>
        <BlocklyIDE height={400} blockIds={[
          {
            blockName: "build",
            inputs: ["builder", "vec"],
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
          },
          {
            blockName: "vec",
            inputs: ["x #", "y #", "z #"],
            output: true,
            doParens: true,
            doBlockName: true,
            color: 230
          },
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
      </Example>
        <p style={{fontSize: 20}}>
          What if you wanted to add new Blockly blocks? Or what if you wanted to use the above room building widget to define a function? That's where this React editor comes in handy: 
        </p>
        <Example><JSMirror scope={UIScope} code={`<><p>I'm a React editor!</p></>`} /></Example>
        <p style={{fontSize: 20}}>
          Wanna know how to use the React or Racket code editors? CodeSpells comes with Docs! <DocModalWithButton/>
        </p>
         <Example><JSMirror scope={UIScope} code={`(props)=> {
  const [cells, setCells] = React.useState([]);
  let code = cells.map((c)=> 
  \`(translate 
    (vec 0 \${c.x * 500} \${-c.y * 500}) 
    (sphere 250))\`
  ).join("\\n");
  
  return <>
    <GameOfLife 
      color={"purple"} 
      setCells={setCells}/>
    <MagicMirror 
      additionalButtons={[<CloseUIButton/>]} 
      code={\`(build (overlay \${code}))\`} />    
  </>}`} /></Example>
         <Example><JSMirror scope={UIScope} code={`//Sometimes code is tedious to write by hand...

(props)=>{
const [magicCode, setMagicCode] = useState("");
const [roomUICode, setRoomUICode] = useState("");
const [finalCode, setFinalCode] = useState("");

useEffect(()=>{
  let precompile = magicCode.replace(
    /\\(HOLE1 [^)]*\\)/, 
    \`(HOLE1 \${roomUICode})\`)
    
  prettifyRacketCode(precompile,     
    (c)=>{ setFinalCode(c) })
  }, [roomUICode, magicCode])

return <>
  <RoomUI 
    wrapper={false} 
    onCompile={(code)=>{setRoomUICode(code)}}
  />
  <MagicMirror 
    onChange={
      (editor, data, value)=>{setMagicCode(value)}}
  />
  <MagicMirror 
    code={finalCode}
  />
</>}`
      } /></Example>
        <p style={{fontSize: 20}}>
          Commercial break! Can you imagine the cool next generation programming interfaces we could make with the power of React & Racket at our fingertips? Come help us make them! Or you know, write us into your next grant! 
        </p>
    </>
    )
}

function Slide7(props){

    return(<>
        <Typography variant="h3">Tools for Building Educational Experiences</Typography>
        <p style={{fontSize: 20}}>
          We haven't scratched the surface of what can be done with composable, functional UI components. Making edtech for coding is easy!  
        </p>
        <p style={{fontSize: 20}}>
          Let's look at a kitchen sink example: 
        </p>
         <Example><JSMirror scope={UIScope} code={`//Here are some components that are useful for educational material
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
      <p style={{ fontSize: 20 }}>
        While we were writing <i>Don't Teach Coding</i>, we realized how powerful it would be for our coding examples to be interactive and interleaved with prose. We couldn't do it in the form of a book, so we're doing it now with CodeSpells.  Calling all curriculum developers! Can you imagine your curriculum being this cool?
      </p>
    </>
    )
}

function Slide8(props) {

    return (<>
        <Typography variant="h3">Intermission</Typography>
      <p style={{ fontSize: 20 }}>
        Puzzle: What does this code do? 
      </p>
        <Example><JSMirror scope={UIScope} code={
`(props)=>{
  const [start, setStart] = useState(false)
  
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
    <p style={{ fontSize: 20 }}>
       Let's shoot some projectiles!
    </p>
        <Example><JSMirror scope={UIScope} code={
`<EventLogger/>` } /><CloseUIButton/></Example>
    <p style={{ fontSize: 20 }}>
      Projectile fired in Unreal, Racket forwards event data to React, React components change state: 
    </p>
    <ArchitecturalDiagram
      highlightedNodes={[{ id: "Unreal", color: "red" }, { id: "Racket", color: "orange" }, { id: "React", color: "yellow" }]}
      highlightedEdges={[{ id: "Unreal-Racket", color: "red" }, { id: "Racket-React", color: "orange" }]} />
    <p style={{ fontSize: 20 }}>
      Here's the same EventLogger, but we are changing the component prop to render Cast Spell buttons instead of raw event data: 
    </p>
      <Example><JSMirror scope={UIScope} code={`
<EventLogger
  component={(props)=>{
               return <CastButton 
                         code={\`
(build (sphere 250)
       (event-location \${props.data.racketResponse}))\`} />
                }}>
</EventLogger>`
      
      } /><CloseUIButton/></Example>
    <ArchitecturalDiagram
      highlightedNodes={[{ id: "Unreal", color: "red" }, { id: "Racket", color: "orange" }, { id: "React", color: "yellow" }]}
      highlightedEdges={[{ id: "Unreal-Racket", color: "red" }, { id: "Racket-React", color: "orange" }, { id: "React-Racket", color: "lime" }, { id: "Racket-Unreal", color: "cyan" }]} />
    <p style={{ fontSize: 20 }}>
      What if we turned our CastButtons into MagicMirrors? Let's mess with the code before we cast! What if we wanted to spawn dragons?
    </p>
    </>
    )
}

function Slide10(props) {
  return (<>
    <Typography variant="h3">Events + UI</Typography>
    <Example>
    <p style={{ fontSize: 20 }}>
      Let's build a small "palace" with a Library and a Study: 
    </p>
      <RoomUI/>
    <p style={{ fontSize: 20 }}>
      Let's place trigger zones to let React know which room is which:
    </p>
      <MagicMirror code={`(on-projectile-hit 
  (lambda (e)
    (spawn (zone #:name "Library")
           (event-location e))))`} additionalButtons={[<CloseUIButton/>]}/> 
    <p style={{ fontSize: 20 }}>
      This component will tell us which zone we just entered: 
    </p>
      <JSMirror scope={UIScope} code={`<EventLogger 
    type="zone-enter" 
    lastEventOnly component={(props)=>{
     return props.data.response.name }} />`
    }/>
    <p style={{ fontSize: 20 }}>
      Now, let's edit this component so that it renders documentation when you're in the library and a code editor when you're not. 
    </p>
    
    </Example>
    <p style={{ fontSize: 20 }}>
      Commercial Break: Do you want to build mind palaces for your students? Or otherwise place your curriculum into 3d space? CodeSpells is the tool for you!
    </p>
  </>
    )
}

function Slide11(props) {
    return (<>
        <Typography variant="h3">What about infinite loops?</Typography>
        <p style={{fontSize: 20}}>Give users a way to stop spells.</p>
         <Example><MagicMirror code={`(define s (spawn (projectile)))

(let loop ()
  (shoot s 
         #:with-force (*vec 200 
                            (+vec 
                        		(vec (random) 
                                     (random) 
                                     (random)) 
                      			(vec -0.5 -0.5 -0.5))))
  (sleep 2)
  (loop))`} additionalButtons={[<CloseUIButton/>]}/></Example>
    <p style={{ fontSize: 20 }}>
      Future Work: The interface above is preliminary. We want to give users more powerful UI to understand and control the spells they have running at any given time. 
    </p>
    </>
    )
}

function Slide12(props) {
  return (<>
    <Typography variant="h3">Call for Cool APIs</Typography>
    <p style={{ fontSize: 20 }}>We got this dragon from the Unreal Marketplace.</p>
    <Example notes={"Can we spit fire & sleep in a loop?"}><MagicMirror code={`(define d (spawn (dragon)))

(sleep 5)

(spit-fire d 4)`} additionalButtons={[<CloseUIButton />]} /></Example>
    <p style={{ fontSize: 20 }}>If you make a cool DSL, it will compose with all the other stuff we're making! Like projectile-hit events...</p>
  </>
  )
}

function Slide13(props) {

  return (<>
    <Typography variant="h3">Let's Connect!</Typography>
    <p style={{ fontSize: 20 }}>Reach out to us if you're interested in collaborating, helping with funding, or using CodeSpells in classrooms!</p>
    <p style={{ fontSize: 20 }}>
      <ul>
        <li>lindsey@thoughtstem.com</li>
        <li>stephen@thoughtstem.com</li>
      </ul>
    </p>
    <p style={{ fontSize: 20 }}>You can also chat with us live during our CodeSpells development stream on Twitch, M-F, 9:30am-12pm Pacific Time:</p>
    <ul style={{ fontSize: 20 }}>
      <li>https://www.twitch.tv/codespells</li>
    </ul>
    <p style={{ fontSize: 20 }}>Visit our website to find out more: https://codespells.org</p>
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
        <Slide12 />,
        <Slide13 />,
    ]

    useEffect(() => {
        document.body.style.setProperty("background-color", "transparent", "important");
    }, [])
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentSlide])

    return (<>
        <Container style={{ float: "left", padding: 5 }} maxWidth="sm">
            <div style={{ padding: 10 }}>
                <Card>
                    <CardHeader
                        title={"RacketCon Talk"}
                        subheader={"Racket + React + Unreal = CodeSpells"}
                        action={<HamburgerMenu/>}>
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
                                key="continue-button" onClick={() => 
                                  {
                                    setCurrentSlide(currentSlide + 1)
                                  }}>
                                Next
                            </Button>
                            : ""}
                    </CardActions>
                </Card>
            </div>
        </Container>
    </>)
}