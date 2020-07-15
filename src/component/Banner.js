import React from 'react';
import PropTypes from 'prop-types';

import '../static/css/banner.css';


export default class Banner extends React.Component {
    static defaultProps={
        data:[],
        interval:3000,
        step:1,
        speed:300
    }
    static propTypes={
        data:PropTypes.array,
        interval:PropTypes.number,
        step:PropTypes.number,
        speed:PropTypes.number
    }


    constructor(props, context) {
        super(props, context);
        let {step,speed}=this.props;
        this.state={
            step,
            speed,
        }
    }

    //数据克隆
    componentWillMount() {
        let {data}=this.props,
            cloneData=data.slice(0);
        cloneData.push(data[0]);
        cloneData.unshift(data[data.length-1]);
        this.cloneData=cloneData;
    }

    //自动轮播
    componentDidMount() {
        this.autoTimer=setInterval(this.autoMove,this.props.interval);
    }

    //边界判断
    componentWillUpdate(nextProps,nextState){
        if(nextState.step>(this.cloneData.length-1)){
            this.setState({
                step:1,
                speed:0
            });
        }
        if(nextState.step<0){
            this.setState({
                step:this.cloneData.length-2,
                speed:0
            });
        }
    }

    //处理回退动画
    componentDidUpdate(prevProps, prevState, snapshot) {
        let {step,speed}=this.state;
        if(step===1 && speed===0){
            let delayTimer=setTimeout(()=>{
                clearTimeout(delayTimer);
                this.setState({
                    step:step+1,
                    speed:this.props.speed
                });
            },0)
        }

        if(step===this.cloneData.length-2 && speed===0){
            let delayTimer=setTimeout(()=>{
                clearTimeout(delayTimer);
                this.setState({
                    step:step-1,
                    speed:this.props.speed
                });
            },0)
        }
    }

    render() {
        let {data}=this.props,
            {cloneData}=this;
        if(data.length===0) return '';

        let {step,speed}=this.state,
            wrapperStr={
                width:cloneData.length*1000+'px',
                left:-step*1000+'px',
                transition:`left ${speed}ms linear 0ms`
            };

        return <section className='container'
                        onMouseEnter={this.movePause}
                        onMouseLeave={this.movePlay}
                        onClick={this.handleClick}>
            <ul className="wrapper" style={wrapperStr}
                onTransitionEnd={()=>{
                    this.isRun=false;
                }}>
                {cloneData.map((item, index)=>{
                    let {pic,title}=item;
                    return <li key={index}>
                     <img src={pic} alt={title} />
                    </li>
                })}
            </ul>
            <ul className="focus">
                {data.map((item, index)=>{
                    let tempIndex=step-1;
                    if(step===0){
                        tempIndex=data.length-1;
                    }
                    if(step===(cloneData.length-1)){
                        tempIndex=0;
                    }

                    return <li key={index} data-id={index} className={tempIndex===index?'active':null}></li>
                })}
            </ul>
            <span className="arrow arrowLeft"></span>
            <span className="arrow arrowRight"></span>
        </section>;
    }

    autoMove=()=>{
        this.setState({
            step:this.state.step+1
        });
    };

    movePause = () => clearInterval(this.autoTimer);
    movePlay = () => this.autoTimer = setInterval(this.autoMove, this.props.interval);

    handleClick=ev=>{
        let target=ev.target,
            tarTag=target.tagName,
            tarClass=target.className;

        if(tarTag==='LI'){
            let id=parseFloat(target.getAttribute('data-id'))+1;
            this.setState({
                step:id
            })
        }

        if(tarTag==='SPAN'){
            //防止过快点击
            if (this.isRun) return;
            this.isRun = true;

            if((/Left$/).test(tarClass)){
                this.setState({
                    step:this.state.step-1
                })
            }
            if((/Right$/).test(tarClass)){
                this.setState({
                    step:this.state.step+1
                })
            }
        }

    }
}