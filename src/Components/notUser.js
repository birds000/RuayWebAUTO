import React, { Component } from 'react';

export default class notUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {

    }

    render() {
        return (
            <>
                <div class="container text-center">
                    <h1>ไม่พบข้อมูลผู้ใช้นี้ !!</h1>
                    <p>กรุณาติดต่อเจ้าหน้าที่ระบบ (Admin)</p>
                </div>
            </>
        );
    }
}
