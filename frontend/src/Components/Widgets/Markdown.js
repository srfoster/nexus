import React, { useRef, useEffect, useState } from 'react';
import MarkdownToJsx from "markdown-to-jsx";

export default function Markdown(props){
  return(
    <MarkdownToJsx>{props.children || ""}</MarkdownToJsx> 
  )
}