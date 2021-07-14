
import React from 'react';
import ReactDOM from 'react-dom';
import Bar from './appbar';
import Card from './card'
import Sidebar from './drawer'
//*
ReactDOM.render(<div><div><Bar/></div><div><Sidebar/><Card/></div></div>, document.querySelector('#root'));
/*/
ReactDOM.render(<div><div><Sidebar/><Card/></div></div>, document.querySelector('#root'));
//*/