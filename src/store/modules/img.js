import { postImgData } from "@/api/sign.js";
import { ElMessage, ElLoading } from 'element-plus';
export default {
    state: {
        imgStr: "",
        face: {
            unit: "",
            user_type: "",
            real_name: "",
            id: 0,
            unit_type: "",
            class_group: "",
            user_type_id: 0
        },
        flag: true,
        time: 10
    },
    mutations: {
        SET_IMG(state, data) {
            state.imgStr = data;
            // console.log(data)
        },
        CLEAR_IMG(state) {
            state.face = {
                unit: "",
                user_type: "",
                real_name: "",
                id: 0,
                unit_type: "",
                class_group: "",
                user_type_id: 0,
            };
        }
    },
    actions: {
        getdata({ commit, state }, data) {
            commit("SET_IMG", data);

            if (state.imgStr.length != 0) {
                // try {
                const getdatas = async() => {
                    const loading = ElLoading.service({
                        lock: true,
                        text: "正在识别   " + state.time + 's',
                        background: 'rgba(0, 0, 0, 0.2)',
                    })
                    const timer = setInterval(() => {
                        if (state.time === 0 || state.flag === false) {
                            clearInterval(timer);
                            loading.close();
                            state.time = 10
                            state.flag = true
							window.location.hash= "#/home"
                        } else {
                            state.time--;
                            loading.setText("正在识别" + state.time + 's')
                        }
                    }, 1000);

                    let params = {
                        base64: state.imgStr
                    }
                    const { data } = await postImgData(params);
                    if (data.code === 200) {
                        state.flag = false
                            // console.log(state.flag)
                            // ElMessage({
                            //     message: "对比成功",
                            //     type: 'success',
                            // })
						clearInterval(timer);
                        loading.close()
                    } else {
						clearInterval(timer);
                        loading.close();
                        ElMessage.error(data.msg)
                    }
                    state.face = data.data;
                };
                getdatas();
            }
        },
        cleardata({ commit }) {
            commit("CLEAR_IMG");
        },
    },
};