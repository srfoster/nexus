import { CastButton } from "./Util";

function ExitGameButton(props){
  return (
    <CastButton
      onReturn={(d) => { console.log("Exiting game", d) }}
      code={"(unreal-eval-js \"KismetSystemLibrary.QuitGame(GWorld.GetPlayerController(0))\")"}>Exit Game</CastButton>
  )
}

export default ExitGameButton;