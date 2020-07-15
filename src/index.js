import React from 'react';
import ReactDOM from 'react-dom';
import Banner from './component/Banner';

import './static/css/reset.min.css';


let root=document.getElementById('root');
let IMG_DATA=[];
for (let i = 1; i < 6; i++) {
    IMG_DATA.push({
        id:i,
        title:'',
        pic:require(`./static/images/${i}.jpg`)
    })
}




ReactDOM.render(<main>
    <Banner
    data={IMG_DATA}
    interval={3000}
    step={1}
    speed={300} />
</main>,root);