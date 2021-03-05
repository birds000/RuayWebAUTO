import React, { Component } from 'react';
import { URL } from '../Util/Config'
import axios from 'axios';

export default class register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fields: {},
            errors: {},
            banklist: [],
            user: {},
            loading: false
        }
    }

    async componentDidMount() {
        if (this.props.match.params.id) {
            var id = this.props.match.params.id
            await this.postUser(id)
            await this.getBank()
        } else {
            alert('ไม่มีข้อมูลผู้ใช้')
            window.open('notUser')
        }
    }

    // -------------------------------------------------------------- START Validat ------------------------------------------------------------------------
    handleValidation() {
        let fields = this.state.fields;
        console.log("fields :", fields)
        let errors = {};
        let formIsValid = true;

        //account bank
        if (!fields["banknumber"]) {
            formIsValid = false;
            errors["banknumber"] = "กรุณากรอกข้อมูลเลขบัญชีธนาคาร";
        }

        if (typeof fields["banknumber"] !== "undefined") {
            if (!fields["banknumber"].match(/[0-9]/)) {
                formIsValid = false;
                errors["banknumber"] = "กรุณากรอกเลขบัญชีธนาคารให้ถูกต้อง กรอกได้เฉพาะตัวเลข (0-9) เท่านั้น";
            }
        }

        //telphone
        if (!fields["telphone"]) {
            formIsValid = false;
            errors["telphone"] = "กรุณากรอกข้อมูลเบอร์ติดต่อ";
        }

        if (typeof fields["telphone"] !== "undefined") {
            if (!fields["telphone"].match(/[0]{1}[0-9]{9}/)) {
                formIsValid = false;
                errors["telphone"] = "กรุณากรอกเบอร์ติดต่อให้ถูกต้อง กรอกได้เฉพาะตัวเลข (0-9) เท่านั้น";
            }
        }
        this.setState({ errors: errors });
        return formIsValid;
    }

    contactSubmit(e) {
        e.preventDefault();
        if (this.handleValidation()) {
            alert("Form submitted");
            this.addUser()
        } else {
            alert("กรุณากรอกข้อมูลให้ครบ")
        }
    }

    handleChange(value, field) {
        console.log("value : ", value)
        console.log("filed : ", field)
        let fields = this.state.fields;
        fields[field] = value;
        this.setState({ fields });
    }
    // -------------------------------------------------------------- END Validat ------------------------------------------------------------------------

    // Post User ดึงข้อมูลสมาชิก
    async postUser(id) {
        var body = { userid: id }
        await axios.post(URL + "/line/userprofile", body)
            .then(res => {
                const result = res.data.result
                if (result.userId) {
                    console.log(result)
                    this.setState({ user: result })
                } else {
                    console.log(result)
                    // alert('ข้อมูลผู้ใช้ไม่ถูกต้องกรุณาติดต่อเจ้าหน้าที่ (Admin)')
                    window.open("/notuser", "_self")
                }
            })
            .catch(error => {
                console.log(error);
                alert('การเชื่อมต่อผิดพลาด Post User')
            })
    }

     // GET USER DB  ดึงข้อมูลสมาชิกจากฐานของมูล
     async getUserDB(id) {
        console.log(URL + "/user/userID/" + id)
        await axios.get(URL + "/user/userID/" + id)
            .then(res => {
                if (res.data.status == "success") {
                    const result = res.data.result[0]
                    console.log(result)
                    this.setState({
                        user: {
                            ...this.state.user,
                            user_bank_id: result.user_bank_id,
                            user_banknumber: result.user_banknumber,
                            user_phone: result.user_phone,
                        }
                    })

                    let fields = this.state.fields;
                    fields["telphone"] = result.user_phone;
                    fields["banknumber"] = result.user_banknumber;
                    this.setState({ fields });
                }
                console.log(this.state.user)
            })
            .catch(error => {
                console.log(error);
                alert('การเชื่อมต่อผิดพลาด Get User')
            })
    }

    // UPDATE USER แก้ไขข้อมูลสมาชิก
    async updateUser() {
        var body = ""
        await axios.get(URL + "/user/update", body)
            .then(res => {
                const data = res.data
                console.log(data)
                alert(data.status + " : " + data.message)
            })
            .catch(error => {
                console.log(error);
                alert('การเชื่อมต่อผิดพลาด Update User')
            })
    }

    // GET BANK ดึงข้อมูลธนาคาร
    async getBank() {
        await axios.get(URL + "/bank/all")
            .then(res => {
                const data = res.data
                if (data.status == "success") {
                    this.setState({ banklist: data.result, loading: true }) //
                    this.handleChange(data.result[0].bank_id, "bankid")
                } else {
                    alert(data.status + " : " + data.message)
                }
            })
            .catch(error => {
                console.log(error);
                alert('การเชื่อมต่อผิดพลาด Get Bank')
            })
    }

    // Select รายชื่อธนาคาร
    bankList() {
        const bankList = this.state.banklist
        let list = bankList.map((item, index) =>
            <option key={index} value={item.bank_id}>{item.bank_name_th}</option>
        );
        return (list)
    }

    // รูปแบบ Input
    autoTab(obj, typeCheck, field) {
        /* กำหนดรูปแบบข้อความโดยให้ _ แทนค่าอะไรก็ได้ แล้วตามด้วยเครื่องหมาย
        หรือสัญลักษณ์ที่ใช้แบ่ง เช่นกำหนดเป็น  รูปแบบเลขที่บัตรประชาชน
        4-2215-54125-6-12 ก็สามารถกำหนดเป็น  _-____-_____-_-__
        รูปแบบเบอร์โทรศัพท์ 08-4521-6521 กำหนดเป็น __-____-____
        หรือกำหนดเวลาเช่น 12:45:30 กำหนดเป็น __:__:__
        ตัวอย่างข้างล่างเป็นการกำหนดรูปแบบเลขบัตรประชาชน
        */
        if (typeCheck == 1) { // เลขบัญชีธนาคาร
            var pattern = new String("_-____-_____-_-__"); // กำหนดรูปแบบในนี้
            var pattern_ex = new String("-"); // กำหนดสัญลักษณ์หรือเครื่องหมายที่ใช้แบ่งในนี้     
        } else if (typeCheck == 2) { // โทรศัพท์
            var pattern = new String("__-____-____"); // กำหนดรูปแบบในนี้
            var pattern_ex = new String("-"); // กำหนดสัญลักษณ์หรือเครื่องหมายที่ใช้แบ่งในนี้                 
        } else if (typeCheck == 3) { // ช่องไฟ (เลขชัด)
            var pattern = new String("_ _ _ _ _ _ _ _ _"); // กำหนดรูปแบบในนี้
            var pattern_ex = new String(" "); // กำหนดสัญลักษณ์หรือเครื่องหมายที่ใช้แบ่งในนี้                 
        }
        var returnText = new String("");
        var obj_l = obj.value.length;
        var obj_l2 = obj_l - 1;
        for (let i = 0; i < pattern.length; i++) {
            if (obj_l2 == i && pattern.charAt(i + 1) == pattern_ex) {
                returnText += obj.value + pattern_ex;
                obj.value = returnText;
            }
        }
        if (obj_l >= pattern.length) {
            obj.value = obj.value.substr(0, pattern.length);
        }

        if (field == "telphone"){
            console.log(obj.value.replaceAll("-", ""))
            var value = obj.value.replaceAll("-", "")
            this.handleChange(value, field)
        } else if (field == "banknumber"){
            console.log(obj.value.replaceAll("-", ""))
            var value = obj.value.replaceAll("-", "")
            this.handleChange(value, field)
        }    
    }

    render() {
        return (
            <>
                <br />
                {this.state.loading ?
                    <div class="container">
                        <div class="col-md-7 col-lg-8">
                            <h4 class="mb-3">สมัครสมาชิก</h4>
                            <form class="needs-validation" action="#" method="post" novalidate="" onSubmit={this.contactSubmit.bind(this)}>
                                <div class="row g-3">
                                    <div class="text-center">
                                        <img src={this.state.user.pictureUrl ? this.state.user.pictureUrl : 'https://www.nanohana-ph.jp/images/shop/noimage.png'} class="rounded" alt="No Image" width="80" height="80" id="titleImage" />
                                        <h6 id="titleName" style={{ marginTop: 15 }}>{this.state.user.displayName ? this.state.user.displayName : 'ชื่อ'}</h6>
                                    </div>

                                    <div class="col-12" style={{ marginTop: 10 }}>
                                        <label for="banknumber" class="form-label">ธนาคาร</label>
                                        <select class="form-select" aria-label="Default select example" name="bank_id" onChange={(e) => this.handleChange(e.target.value, "bankid")} >
                                            {this.bankList()}
                                        </select>
                                    </div>

                                    <div class="col-12" style={{ marginTop: 10 }}>
                                        <label for="banknumber" class="form-label">เลขบัญชีธนาคาร</label>
                                        <div class="input-group has-validation">
                                            <span class="input-group-text"><i class="material-icons">account_balance</i></span>
                                            <input type="text" class="form-control" pattern="[0-9]" id="banknumber" name="banknumber" onKeyUp={(e) => this.autoTab(e.target, 1, "banknumber")} />
                                            <div class="invalid-feedback">
                                                กรุณากรอกเลขบัญชีธนาคารให้ถูกต้อง
                                        </div>
                                        </div>
                                        <div class="error" class="form-text text-danger">{this.state.errors["banknumber"]}</div>
                                    </div>

                                    <div class="col-12" style={{ marginTop: 10 }}>
                                        <label for="telphone" class="form-label">เบอร์ติดต่อ</label>
                                        <div class="input-group has-validation">
                                            <span class="input-group-text"><i class="material-icons">phone_enabled</i></span>
                                            <input type="tel" class="form-control" id="telphone" name="telphone" pattern="[0]{1}[0-9]{9}" onKeyUp={(e) => this.autoTab(e.target, 2, "telphone")} />
                                            <div class="invalid-feedback">
                                                กรุณากรอกเบอร์ติดต่อให้ถูกต้อง
                                        </div>
                                        </div>
                                    </div>
                                    <div class="error" class="form-text text-danger">{this.state.errors["telphone"]}</div>

                                    <input type="hidden" value="" name="userId"></input>
                                </div>
                                <hr class="my-4"></hr>
                                <div class="text-muted">หมายเหตุ : กรูณากรอกข้อมูลที่เป็นความจริงเนื่องจากต้องใช้ข้อมูลนี้ในการ ฝาก ถอน</div>
                                <br />
                                <div class="d-grid gap-2">
                                    <button class="w-100 btn btn-success" type="submit">ยกเลิก</button>
                                    <button class="w-100 btn btn-light" type="submit">ยืนยันการแก้ไข</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    :
                    <div class="d-flex justify-content-center">
                        <div class="spinner-border text-primary" role="status">
                            <span class="sr-only"></span>
                        </div>
                    </div>
                }
            </>
        );
    }
}
