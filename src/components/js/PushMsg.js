import React, { Component } from 'react';
import '../css/push.css';
import $ from 'jquery'

/**
 * 1. 메시지 개행 UI
 * 2. 확대 축소 UI
 * 3. 자세히 보기 UI
 */
export default class PushMsg extends Component {

    constructor(props) {
        super(props)
        this.eleMsgOpen = React.createRef();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.msgid !== nextProps.msgid;
    }

    render() {
        const self = this;
        const { msg, ext, msgid } = this.props;
        const imageUrl = (img) => { return "https://img2.kbcard.com/msg/cxv/template/system/" + img; }

        const convert = (text) => {
            var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
            var text1 = text.replace(exp, "<a href='$1'>$1</a>");
            var exp2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
            return text1.replace(exp2, '$1<a target="_blank" href="http://$2">$2</a>');
        }

        const msgToTag = msg.split("\n").map(function (item, index) {
            var rUrlRegex = /(http(s)?:\/\/|www.)([a-z0-9\w]+\.*)+[a-z0-9]{2,4}([\/a-z0-9-%#?&=\w])+(\.[a-z0-9]{2,4}(\?[\/a-z0-9-%#?&=\w]+)*)*/gi;
            var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/i;
            var url = item.match(rUrlRegex);

            if (url != null)
                return <React.Fragment key={index}>{item.substring(0, item.indexOf("http"))}<a href={url} className="linkStyle"> {url} </a><br /></React.Fragment>
            else
                return <React.Fragment key={index}>{item}<br /></React.Fragment>
        });

        const replaceUrl = (url) => {
            return url.replace("kbcardmain://openUrl", "");
        }

        const clickMsgOpen = (e) => {

            var thisEle = self.eleMsgOpen.current;
            $(thisEle).toggleClass('up');
            //PUSH내용 초기 세팅
            var cont = $(thisEle).closest('.btnToggle').siblings('.cont'),
                contH = cont.children('p').outerHeight(),
                duration = contH > 500 ? contH : 500;

            if ($(thisEle).hasClass('up')) {
                //PUSH내용 보임
                cont.css({ display: 'block', maxHeight: 'none', height: 60 })
                contH = cont.children('p').outerHeight();
                duration = contH > 500 ? contH : 500;
                cont.css({ height: contH, 'transition-duration': duration + 'ms' });
            } else {
                //PUSH내용 닫힘
                cont.css({ height: 60 });
                setTimeout(function () {
                    cont.css({ display: '-webkit-box', maxHeight: 60, height: 'auto' });
                }, duration)
            }
            e.preventDefault();
        }

        return (
            <div id="checkboxes">

                {/* 이미지 배너 */}
                {ext[0].value !== "" ?
                    <span className="banner">
                        <img src={imageUrl(ext[0].value)} alt="" />
                    </span>
                    : ""}
                {/* 메시지 내용 */}
                <div className="cont">
                    <p className="shortMsg">{msgToTag}</p>
                </div>

                {/* 이미지 펼치기 버튼 */}
                {msg.split("\n").length > 6 ?
                    <div className="btnToggle"><a href="#kbcard" ref={this.eleMsgOpen} className="toggleUI" onClick={clickMsgOpen} ><span>이벤트 내용 펼쳐짐</span></a></div>
                    : ""}

                {/*msgOpenBtn*/}

                {/* 링크 버튼 */}
                {ext.length === 3 && ext[2].value !== "" ?
                    <div className="eventBtn"><a href={replaceUrl(ext[2].value)} className="btnL btnWhite">자세히보기</a></div>
                    : ""}

                {/* 삭제 클릭시 보이는 UI */}
                <div className="select">
                    <label htmlFor={"push" + msgid}>해당 알림 삭제하기</label>
                    <input type="checkbox" id={"push" + msgid} name={msgid} className="inp1" value={msgid} />
                </div>

            </div>
        );
    }
}