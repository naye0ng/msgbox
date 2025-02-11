import React, { Component } from 'react';
import '../css/push.css';
import $ from 'jquery'

/**
 * PushList에서 받아온 Data를
 * 그려주는 화면, PushList의 각 내용을
 * 확인할 수 있는 component 
 */
export default class PushMsg extends Component {

    constructor(props) {
        super(props)
        this.eleMsgOpen = React.createRef();
        this.eleMore = React.createRef();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.msgid !== nextProps.msgid;
    }

    render() {
        const self = this;
        const { msg, ext, msgid } = this.props;
        const imageUrl = (img) => { return "https://img2.kbcard.com/msg/cxv/template/system/" + img; }

        const msgToTag = msg.split(/\n|\\n/).map(function (item, index) {
            
            
            // url or tel 정규식 - |:[0-9]{3,4} 포트정보 제거
            var regex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._ㄱ-ㅎ가-힣ㅏ-ㅣ\+~#=]{2,256}(\.[a-z]{2,6})\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)|[☎☏]{1}[0-9\- ]{8,14}/gi;
            // url 정규식 - |:[0-9]{3,4} 포트정보 제거
            var urlRegex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._ㄱ-ㅎ가-힣ㅏ-ㅣ\+~#=]{2,256}(\.[a-z]{2,6})\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/gi;

            var arr = item.match(regex);

            var eles = [];
            if (arr != null && arr.length > 0) {
                var startIndexOf = 0 ;
                for (var i = 0; i < arr.length; i++) {
                    eles.push(item.substring(startIndexOf, item.indexOf(arr[i])));
                    if (urlRegex.test(arr[i]))
                        eles.push(<a href={arr[i].startsWith("http")?arr[i]:"http://"+arr[i]} key={"jsxUrl"+i} className="linkStyle"> {arr[i]} </a>);
                    else 
                        eles.push(<a href={"tel:"+arr[i].substring(1)} key={"jsxUrl"+i} className="linkStyle"> {arr[i]} </a>);
                    startIndexOf = item.indexOf(arr[i]) + arr[i].length;
                }
                if (item.length > startIndexOf) eles.push(item.substring(startIndexOf, item.length));
            }

            if (eles.length > 1)
                return <React.Fragment key={index}>{eles}<br /></React.Fragment>
            else
                return <React.Fragment key={index}>{item}<br /></React.Fragment>
        });

        const replaceUrl = (url) => {
            let str = url || '';
            return str.replace("kbcardmain://openUrl", "");
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
                cont.css({ display: 'block', maxHeight: 'none', height: 120 })
                contH = cont.children('p').outerHeight();
                duration = contH > 500 ? contH : 500;
                cont.css({ height: contH, 'transition-duration': duration + 'ms' });
            } else {
                //PUSH내용 닫힘
                cont.css({ height: 120 });
                setTimeout(function () {
                    cont.css({ display: '-webkit-box', maxHeight: 120, height: 'auto' });
                }, duration)
            }
            e.preventDefault();
        }

        //푸시 전용 common
        const pushCommon = {
            layerPopup : {
                openPopup : function(selector) {
                    var $sel = selector,
                        top = $($sel).outerHeight() / 2 * -1;

                    pushCommon.layerPopup.beforeTarget = 'a[href="'+ $sel +'"]';
                    $('.pushEvent').css({zIndex: 900});
                    $(selector).css({marginTop: top + 'px', right: 0}).fadeIn(300);
                    $('.dim').fadeIn(300).closest('body').css({overflow:'hidden'});	
                    $('#content').attr('aria-hidden',true);
                    setTimeout(function() {pushCommon.goFocus($sel)}, 300);
                }, 
                closePopup : function(selector) {
                    $(selector).closest('.layerWrap').hide();
                    $('.dim').hide().closest('body').css({overflow:'auto'});	
                    $('#content').attr('aria-hidden',false);
                    $('.pushEvent').css({zIndex: 9001});
                    if(pushCommon.layerPopup.beforeTarget.length > 0) {
                        setTimeout(function() {pushCommon.goFocus(pushCommon.layerPopup.beforeTarget);}, 100)
                    }
                },
                beforeTarget : ''	
            },
            goFocus : function(target) {
                var $target = $(target),
                    i = 0,
                    getFirstChild = (function getFirstChild(elem) {
                        var $elem = $(elem),
                            getChildren = null;
                                            
                        if($elem.children().length > 0) {
                            getChildren = $elem.children().eq(0);
                            
                            if(getChildren.hasClass('hidden') || getChildren.is(':hidden')) {
                                getChildren = getChildren.next();
                            }
                            return getFirstChild(getChildren);
                        } else {
                            return $elem;
                        }
                    }($target));
                    
                getFirstChild.css('outline', 'none');
                getFirstChild.attr('tabindex', '0');
                getFirstChild.focus();
                getFirstChild.off('focusout.goFocus');
                getFirstChild.on('focusout.goFocus', function() {
                    $(this).removeAttr('tabindex');
                });
            }
        }
        //레이어팝업 IN
        const clickOption = (e) => {
            var thisEle = self.eleMore.current;
            pushCommon.layerPopup.openPopup($(thisEle).attr('href'));
            //setTimeout(function() {}, 1000);
            $(thisEle).attr('data-target','this');
            pushCommon.layerPopup.beforeTarget = 'a[data-target="this"]';
            this.props.setShareContent(self.props.msg);
        }

        //레이어팝업 OUT
        $('#Wrap').on('click', '.popClose', function() {
            pushCommon.layerPopup.closePopup('#' + $(this).closest('.layerWrap').attr('id'));
            setTimeout(function() {$('a[data-target="this"]').removeAttr('data-target');}, 200)
        });

        $('#Wrap').on('click', '.shareImg', function() {
            pushCommon.layerPopup.closePopup('#' + $(this).closest('.layerWrap').attr('id'));
            setTimeout(function() {$('a[data-target="this"]').removeAttr('data-target');}, 200);
        });
        
        $('#Wrap').on('click', '.delete', function() {
            pushCommon.layerPopup.closePopup('#' + $(this).closest('.layerWrap').attr('id'));
            setTimeout(function() {$('a[data-target="this"]').removeAttr('data-target');}, 200);
        });

        return (
            <div id="checkboxes">

                {/* 이미지 배너 */}
                {!ext[0].value ?
                    "" : <span className="banner">
                        <img src={imageUrl(ext[0].value)} alt="" />
                    </span>}
                    
                {/* 메시지 내용 */}
                <div className="cont">
                    <p className="shortMsg">{msgToTag}</p>
                </div>

                {/* 이미지 펼치기 버튼 */}
                {(msg.split(/\n|\\n/).length > 6) || (msg.length > 90) ?
                    <div className="btnToggle" aria-hidden="true"><a href="#kbcard" ref={this.eleMsgOpen}  className="toggleUI" title="위 이벤트 내용이 일부분만 보여져 전체를 보여줌" onClick={clickMsgOpen} ><span>이벤트 내용 펼쳐짐</span></a></div>
                    : ""}
                {/*msgOpenBtn*/}

                {/* 링크 버튼 */}
                {ext.length === 3 && ext[2].value !== "" ?
                    <div className="eventBtn"><a href={replaceUrl(ext[2].value)} className="btnL btnWhite">{ext[1].value?ext[1].value:"자세히보기"}</a></div>
                    : ""}
                
                <div className="more"><a href="#listMenu" ref={this.eleMore} onClick={clickOption} className="layerOpen" title="팝업창 열림">옵션</a></div>

                {/* 삭제 클릭시 보이는 UI */}
                <div className="select">
                    <label htmlFor={"push" + msgid}>해당 알림 삭제하기</label>
                    <input type="checkbox" id={"push" + msgid} name={msgid} className="inp1" value={msgid} />
                </div>

            </div>
        );
    }
}