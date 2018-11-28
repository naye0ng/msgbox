import React from 'react';
import '../css/push.css';
import PushRadioSel from './PushRadioSel';
import PushResult from './PushResult';
import PushDelete from './PushDelete';
import PushList from './PushList';
import PushEvent from './PushEvent';
import ReactRefreshInfiniteTableView from '../../lib/ReactRefreshInfiniteTableView.js';

export default class Content extends ReactRefreshInfiniteTableView  {

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.list !== nextProps.list;
    }

    render() {
        const {handleCategoryToChange, category, list, handleCheckedChange, handleDeleteClick, checkedItems, handleCheckedAllClick, authKey, eventList} = this.props;
        return (
            <div id="content" className="content" onScroll={this.viewDidScroll} >
                <section className="container" >
                    <div className="pushArea">
                        {/* 카테고리 선택 */}
                        <PushRadioSel handleCategoryToChange={handleCategoryToChange}
                        category={category} />
                        {/* 갯수/삭제버튼 */}
                        <PushResult />
                        {/* 삭제 레이어 */}
                        <PushDelete handleDeleteClick={handleDeleteClick} handleCheckedAllClick={handleCheckedAllClick}/>
                        {/* 목록 */}
                        <PushList dataSource={list} handleCheckedChange={handleCheckedChange} checkedItems={checkedItems} authKey={authKey} />
                        {/* 이벤트 레이어 */}
                        <PushEvent eventList={eventList}/>
                    </div>
                </section>
            </div>
        );
    }
}