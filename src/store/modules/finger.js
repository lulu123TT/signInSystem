export default {
    state: {
        data: {
            unitGroup: "",
            userGroup: "",
            realName: "",
        },
    },
    mutations: {
        GET_DATA(state, data) {
            console.log(
                "%c 🍗 data: ",
                "font-size:20px;background-color: #E41A6A;color:#fff;",
                data
            );
            state.data.unitGroup = data.unitGroup;
            state.data.userGroup = data.userGroup;
            state.data.realName = data.realName;
        },
    },
};