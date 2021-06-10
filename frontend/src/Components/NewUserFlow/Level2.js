import React, { useEffect, useState } from 'react';
import { Level, ContinueButton } from './Level';


export function Level2(props) {
  return (
    <>
      <Level number={2} subtitle={"Beyond the Gate"}>
        <ContinueButton
          onComplete={() => {
            props.setBadges(props.badges.concat([{ name: props.badgeName }]));
          }
          }></ContinueButton>
      <ul>
        <li>Need to remind people that CodeSpells isn't just 1 story or 1 game. But here's 1 story...</li>
        <li>Thought Experiment: What if there was magic somewhere? How would society evolve?</li>
        <li>Fictional Story: Mind Painters (front-end dev that's actually magic)</li>
        <li>Setting up the world: humanoid people can visualize 2D interfaces, can paint and show their ideas on these</li>
          <li>Puzzle: Something about interacting with interfaces.
             Or a mock-reading-comprension question.</li>

        <li></li>
      </ul>
      </Level>
    </>
  )
}
/* Lindsey: Spaced repetition */
/*
Laurond: I have a character for you.. an individual who starts out in the lower caste and isn't considered creative or precise during childhood because their paintings and images make no sense to others, but then the *disruptive plot device event* causes them and a few others to be in a survival situation apart from the rest of the community, and nobody knows what to do, but the character has some ideas, and start learning how to communicate them instead of making the abstract art they used to make.
*/

export default Level2;