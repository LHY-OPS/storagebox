<template>
    <div class="order">
        <!-- 查询 -->
        <el-card class="order-box-card">
            <el-form
                :model="orderform"
                ref="orderform"
                label-width="100px"
                class="ordermanageselform"
            >
                <el-form-item label="客户名称" prop="nickName" class="name">
                    <el-input
                        v-model="orderform.nickName"
                        class="nameInp"
                    ></el-input>
                </el-form-item>

                <el-form-item label="订单状态" prop="status" class="status">
                    <el-select
                        v-model="orderform.status"
                        placeholder="请选择"
                        class="orderelselect"
                    >
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <el-button type="primary" @click="search()" class="ordersearchBtn">
                查询
            </el-button>
            <el-button @click="resetForm('orderform')" class="orderresetBtn">
                重置
            </el-button>
        </el-card>

        <!-- 客户列表 -->
        <el-card class="order-box-card-list">
            <el-button type="primary" @click="detail()" class="orderdetailBtn">
                详情
            </el-button>

            <el-button type="primary" @click="Delete()">删除</el-button>

            <sirui-table
                :data="orderData"
                :page="page"
                :tableHeight="tableHeight"
                @handleSelectionChange="handleSelectionChange"
                @handleSizeChange="handleSizeChange"
                @handleCurrentChange="handleCurrentChange"
            >
                <el-table-column type="selection" width="80"></el-table-column>
                <el-table-column
                    label="订单编号"
                    prop="orderCode"
                    :show-overflow-tooltip="true"
                ></el-table-column>

                <el-table-column
                    label="订单名称"
                    prop="orderName"
                    :show-overflow-tooltip="true"
                ></el-table-column>

                <el-table-column
                    label="订单状态"
                    prop="status"
                    :show-overflow-tooltip="true"
                ></el-table-column>

                <el-table-column
                    label="客户名称"
                    prop="nickName"
                    :show-overflow-tooltip="true"
                ></el-table-column>

                <el-table-column
                    label="箱子id"
                    prop="boxId"
                    :show-overflow-tooltip="true"
                ></el-table-column>

                <el-table-column
                    label="箱子编号"
                    prop="boxCode"
                    :show-overflow-tooltip="true"
                ></el-table-column>

                <el-table-column
                    label="箱子规格"
                    prop="boxStandard"
                    :show-overflow-tooltip="true"
                ></el-table-column>

                <el-table-column
                    label="所需积分"
                    prop="boxUnitPrice"
                    :show-overflow-tooltip="true"
                ></el-table-column>

                <el-table-column
                    label="租赁时长"
                    prop="leaseDuration"
                    :show-overflow-tooltip="true"
                ></el-table-column>

                <el-table-column
                    label="实付积分"
                    prop="totalPrice"
                    :show-overflow-tooltip="true"
                ></el-table-column>

                <el-table-column
                    label="空箱上门下单时间"
                    v-if="emptyShow"
                    prop="emptyBoxOrderTime"
                    :show-overflow-tooltip="true"
                ></el-table-column>

                <el-table-column
                    label="重箱上门下单时间"
                    v-if="heavyShow"
                    prop="heavyBoxOrderTime"
                    :show-overflow-tooltip="true"
                ></el-table-column>

                <el-table-column
                    fixed="right"
                    label="操作"
                    prop="operation"
                    :show-overflow-tooltip="true"
                >
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            @click="sendNull(scope.row)"
                            v-if="scope.row.status == '1'"
                            style="color: orange"
                        >
                            发送空箱
                        </el-button>
                        <el-button
                            size="mini"
                            @click="sendNull(scope.row)"
                            v-if="scope.row.status == '6'"
                            style="color: black"
                        >
                            发送重箱
                        </el-button>
                        <el-button
                            size="mini"
                            @click="sendNull(scope.row)"
                            v-if="scope.row.status == '4'"
                            style="color: yellow"
                        >
                            收取重箱
                        </el-button>
                        <el-button
                            size="mini"
                            @click="sendNull(scope.row)"
                            v-if="scope.row.status == '9'"
                            style="color: green"
                        >
                            收取空箱
                        </el-button>
                        <el-button
                            size="mini"
                            v-if="scope.row.status == '10'"
                            style="color: red"
                            @click="deleteOrder(scope.row)"
                        >
                            删除订单
                        </el-button>
                        <el-button
                            size="mini"
                            v-else
                            style="display: none"
                        ></el-button>
                    </template>
                </el-table-column>
            </sirui-table>

            <Order-detail ref="details"></Order-detail>
        </el-card>
    </div>
</template>

<script>
import SiruiTable from "../../components/SiruiTable/index";
import OrderDetail from "../orderManages/OrderDetail";
export default {
    components: {
        SiruiTable,
        OrderDetail,
    },

    data() {
        return {
            tableHeight: 400,
            emptyShow: true,
            heavyShow: true,
            orderform: {
                nickName: "",
                status: "",
            },
            page: {
                pages: 0,
                total: 0,
                pageSize: 10,
                pageNum: 1,
            },
            options: [
                {
                    label: "待发空箱",
                    value: 1,
                },
                {
                    label: "已发空箱",
                    value: 2,
                },
                {
                    label: "送达空箱",
                    value: 3,
                },
                {
                    label: "待收重箱",
                    value: 4,
                },
                {
                    label: "已存储",
                    value: 5,
                },
                {
                    label: "待发重箱",
                    value: 6,
                },
                {
                    label: "已发重箱",
                    value: 7,
                },
                {
                    label: "送达重箱",
                    value: 8,
                },
                {
                    label: "待收空箱",
                    value: 9,
                },
                {
                    label: "已完成",
                    value: 10,
                },
            ],
            allTableData: [],
            orderData: [],
            multipleSelection: [],
            operate: "",
        };
    },

    mounted() {
        this.heavyBox();
        this.getData();
    },

    methods: {
        heavyBox(data) {
            console.log(data);
        },

        // 查询用户
        search() {
          this.getData();
            //   filter 不会改变原数组
            //   filter 遍历的元素范围在第一次调用callback之前就已经确定了
            //   在调用filter之后被添加到数组中的元素不会被filter遍历到
            //   如果已经存在的元素被改变了，则他们传入callback的值是filter遍历到他们那一刻的值
            //   被删除或从来未被赋值的元素不会被遍历到
            //   includes()方法用于判断字符串是否包含指定的子字符串
            //   如果找到匹配的字符串则返回true，否则返回false
            //   slice()方法可从已有的数组中返回选定的元素

            this.orderData = this.allTableData
                .filter((item) => {
                    return (
                        item.nickName.includes(this.orderform.nickName) &&
                        item.status.includes(this.orderform.status)
                    );
                    //return true
                })
                .slice(
                    //第几页 每页显示条数
                    (this.page.pageNum - 1) * this.page.pageSize,
                    this.page.pageNum * this.page.pageSize
                );
            this.page.total = this.allTableData.length;
            console.log("orderData", this.orderData);
        },

        // 重置
        resetForm(formName) {
            if (this.$refs[formName] != undefined) {
                this.$refs[formName].resetFields();
                this.getData();
            }
        },

        // 显示详细信息

        // 查询数据列表
        getData() {
            this.$axios
                .get(
                    this.$store.state.url +
                        "/backend/order/list?" +
                        "pageNum=" +
                        this.page.pageNum +
                        "&pageSize=" +
                        this.page.pageSize +
                        "&searchValue=" +
                        this.orderform.nickName
                )
                .then((res) => {
                    if (200 == res.data.code) {
                        this.orderData = res.data.rows;
                        this.page.total = res.data.total;
                        this.$message({
                            showClose: true,
                            message: "查询成功",
                            type: "success",
                        });
                    } else {
                        this.$message({
                            showClose: true,
                            message: res.data.msg,
                            type: "error",
                        });
                    }
                });
        },

        // 订单详情
        detail() {
            if (1 == this.multipleSelection.length) {
                this.$refs.details.openDialog(
                    true,
                    JSON.parse(JSON.stringify(this.multipleSelection))
                );
            } else if (this.multipleSelection.length > 1) {
                this.$message({
                    type: "info",
                    message: "请选择一条数据进行操作",
                });
            } else {
                this.$message({
                    type: "info",
                    message: "请选择数据进行操作",
                });
            }
        },

        // 删除
        Delete(){
      if(this.multipleSelection.length >= 1){
                this.$confirm("是否删除","提示",{
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type:"warning",
                })
                    .then(() =>{
                        let params = {
                            ids:[]
                        };
                        for (var i= 0;i<this.multipleSelection.length; i++){
                            params.ids.push(this.multipleSelection[i].id);
                        }
                        params.ids = params.ids.join(",");
                      
                            this.$axios
                            .delete(
                                this.$store.state.url + "/backend/order/delete/"+params.ids
                            )
                            .then((res) => {
                                if (200 == res.data.code) {
                                    this.getData();
                                    this.$message({
                                      
                                        message: res.data.msg,
                                        type: "success",
                                    });
                                } else {
                                    this.$message({
                                       
                                        message: res.data.msg,
                                        type: "error",
                                    });
                                }
                            })
                        
                    })
            }
       
    },

        // 发送空箱
        sendNull(row) {
            if (row.status == 1) {
                this.operate = 2;
            } else if (row.status == 2) {
                this.operate = 3;
            } else if (row.status == 3) {
                this.operate = 4;
            } else if (row.status == 4) {
                this.operate = 5;
            } else if (row.status == 5) {
                this.operate = 6;
            } else if (row.status == 6) {
                this.operate = 7;
            } else if (row.status == 7) {
                this.operate = 8;
            } else if (row.status == 8) {
                this.operate = 9;
            } else if (row.status == 9) {
                this.operate = 10;
            } else if (row.status == 10) {
                this.operate = 10;
            }

            // console.log("肉" + row.status);
            // console.log("操作"+ this.operate);

            let params = {
                id: row.id,
            };

            this.$axios
                .put(
                    this.$store.state.url +
                        "/backend/order/operate/" +
                        row.id +
                        "/" +
                        this.operate +
                        "/" +
                        row.version,
                    params
                )
                .then((res) => {
                    if (res.data.code == 200) {
                        this.$message({
                            type: "success",
                            message: res.data.msg,
                        });
                        this.getData();
                    } else {
                        this.$message({
                            type: "error",
                            message: res.data.msg,
                        });
                    }
                });
        },

        // 重箱信息填写
        ZX() {
            this.$refs.heavyBox.openDialog(true);
        },

        // 删除订单
        deleteorder(item) {
            console.log(item);
            this.$confirm("此操作将永久删除该文件，是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.$axios
                        .delete(
                            this.$store.state.url +
                                "/backend/order/delete/" +
                                item.id
                        )
                        .then((res) => {
                            if (res.data.code == 200) {
                                this.$message({
                                    type: "success",
                                    message: res.data.msg,
                                });
                                this.getData();
                            } else {
                                this.$message({
                                    type: "error",
                                    message: res.data.msg,
                                });
                            }
                        });
                    this.$message({
                        type: "success",
                        message: "删除成功!",
                    });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "己取消删除",
                    });
                });

            if (!this.multipleSelection.length) {
                this.$message({
                    type: "error",
                    message: "请勾选数据",
                });

                return;
            }

            this.$confirm("确定要删除选中数据吗?")
                .then(() => {
                    //当数组中的元素在测试条件时返回 true 时，findIndex()返回符合条件的元素的索引位置，之后
                    //如果没有符合条件的元素返回-1
                    let currentIndex = this.allTableData.findIndex((myitem) => {
                        return myitem.boxId === item.boxId;
                    });
                    //console.log( "currentIndex" , currentIndex );
                    this.allTableData.splice(currentIndex, 1);

                    this.getData();
                })

                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "己取消删除",
                    });
                });
        },

        // 每页条数
        handleSizeChange(val) {
            this.page.pagesize = val;
            this.getData();
        },

        // 选中触发事件
        handleSelectionChange(row) {
            this.multipleSelection = row;
            // alert(JSON.stringify(this.multipleSelection)) ;
        },

        // 第几页
        handleCurrentChange(val) {
            this.page.pageNum = val;
            this.getData();
        },
    },
};
</script>

<style>
.order-box-card {
    height: 180px;
    line-height: 180px;
}

.order-box-card .el-card__body {
    height: 40px;
    line-height: 40px;
    padding: 70px 20px;
}

.order-box-card .ordermanageselform .name {
    width: 500px;
    margin-right: 25px;
    float: left;
}

.order-box-card .ordermanageselform .status {
    width: 330px;
    margin-right: 10px;
    float: left;
}

.ordermanageselform .name .el-form-item__content {
    margin-left: 60px !important;
}

.ordermanageselform .status .el-form-item__content {
    margin-left: 60px !important;
}

.nameInp {
    width: 400px;
}

.ordersearchBtn {
    float: left;
    margin: 0 50px;
}

.orderresetBtn {
    float: left;
    margin-left: 100px;
}

.order-box-card-list {
    margin-top: 25px;
}

.order-box-card-list .el-card__body {
    height: 560px;
    padding: 25px;
}

.sirui-table {
    margin-top: 25px;
}

.sirui-table .block .el-pagination {
    margin-bottom: 0;
    margin-top: 35px;
}
</style>

<style scoped>
.order {
    margin: 25px;
}
</style>