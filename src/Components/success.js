import React, { Component } from 'react';

export default class success extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <>
                <div class="container">
                    <div class="alert alert-success" role="alert">
                        <h4 class="alert-heading">ทำรายการเสร็จสิ้น!</h4>
                        <p>ยินดีต้อนรับ ท่านสามรถเข้าสู่ระบบ และสามารถเข้าเล่นได้ที่ ....... </p>
                        <p>ระบบนี้สามารถ ฝาก ถอน เงินได้อัตโนมัติผ่านช่องทาง RUAY95 AUTO โดยข้อมูลการฝากถอนต้องตรงกับข้อมูลที่ท่านลงทะเบียนไว้ในระบบเท่านั้น</p>
                        <hr />
                        <p class="mb-0">หากมีปัญหาสอบถามเพิ่มเติมได้ที่ ......... </p>
                    </div>
                </div>
            </>
        );
    }
}
