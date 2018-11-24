import React, { Component } from 'react';
import '../css/push.css';

export default class PushDelete extends Component {

    render() {

        return (
            <div className="pushDelete">
                <button type="button" className="close"><span>취소</span></button>
                <button type="button" className="check"><span>전체선택</span></button>
                <button type="button" className="trash" disabled=""><span>삭제</span></button>{/* 삭제 버튼 활성화 하려면 disabled 해제 */}
			</div>
        );
    }
}