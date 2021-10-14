import React, { useRef, useEffect, useState } from 'react';
import { BlocklyIDE, JSMirror, MultipleChoiceQuestion } from '../Widgets/Educational';
import { CastButton, EventLogger, sendOnCodeSpellsSocket, SpellThreadManager } from './Util';
import { AppBar, Badge, Card, ButtonGroup, CardActions, CardContent, CardHeader, Chip, CircularProgress, Paper, Radio, RadioGroup, Slider, Tab, Button, Typography } from '@material-ui/core';
import { DidYouKnowCard, PleaseWaitWhileSockPuppetCreatesContent } from '../Widgets/NexusVoice';
import SimpleVideoPlayer from '../Widgets/SimpleVideoPlayer';
import ChatBubble from '../Widgets/ChatBubble';
import RoomUI from './RoomUI';
import BlueBalls from '../Widgets/BlueBalls';
import { Game } from '../Widgets/react-gameoflife/Game';
import NetworkDiseaseSimulator from '../Widgets/NetworkDiseaseSimulator';
import { defineRacketBlock, defineStatementRacketBlock } from '../Dashboard/customBlocks/custom_Blocks';
import CloseUIButton from './CloseUIButton';
import { MagicMirror } from '../MagicMirror';
import { DocContent, DocModalWithButton } from '../Widgets/Docs'; //Note: circular dependency!

export let UIScope = {
  useEffect,
  useState,
  CloseUIButton,
  JSMirror: (props)=>{return <JSMirror code={props.code} onChange={props.onChange} scope={UIScope}/>},
  SpellThreadManager,
  EventLogger,
  MagicMirror,
  RoomUI,
  BallPitToy: BlueBalls,
  GameOfLife: Game,
  BlocklyIDE,
  defineStatementRacketBlock,
  defineRacketBlock,
  NetworkDiseaseSimulator,
  CastButton,
  DocModalWithButton,
  DocContent,
  DidYouKnowCard,
  SimpleVideoPlayer,
  PleaseWaitWhileSockPuppetCreatesContent,
  ChatBubble,
  Button,
  Badge, AppBar, Badge, Card, ButtonGroup, 
  CardActions, CardContent, CardHeader, Chip, 
  CircularProgress, Paper, Radio, RadioGroup, Slider,
  Typography,
  MultipleChoiceQuestion,
}