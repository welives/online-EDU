<template>
  <div class="app-container">
    <div class="filter-container f-row">
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
      <div class="ml-auto">
        <el-select v-model="listQuery.status" placeholder="状态" clearable style="width: 90px" class="filter-item">
          <el-option v-for="(item, key) in statusOptions" :key="key" :label="item" :value="key" />
        </el-select>
        <el-input
          v-model="listQuery.title"
          placeholder="标题"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
      </div>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass">
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="内容" min-width="150px">
        <template slot-scope="{ row }">
          <div class="cont f-row">
            <img :src="row.cover" />
            <div class="f-col">
              <span class="link-type" @click="handleUpdate(row)">{{ row.title }}</span>
              <span class="price">￥{{ row.price }}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="订阅量" align="center" width="100">
        <template slot-scope="{ row }">
          <span>{{ row.subCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="100">
        <template slot-scope="{ row }">
          <el-tag :type="row.status ? 'success' : 'danger'">
            {{ row.status | statusFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.create_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{ row, $index }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status === 0" size="mini" type="success" @click="handleModifyStatus(row, 1)">
            上架
          </el-button>
          <el-button v-if="row.status === 1" size="mini" @click="handleModifyStatus(row, 0)">
            下架
          </el-button>
          <el-popconfirm class="ml-10" title="是否要删除这条数据？" @onConfirm="handleDelete(row, $index)">
            <el-button v-if="row.status != 'deleted'" slot="reference" size="mini" type="danger">
              删除
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog fullscreen :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="80px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="封面" size="normal">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleUploadRemove"
            :on-success="handleUploadSuccess"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
        <el-form-item label="试看内容" prop="try">
          <tinymce ref="tryContent" v-model="temp.try" :height="300" :width="750" />
        </el-form-item>
        <el-form-item label="课程内容" prop="content">
          <tinymce ref="payContent" v-model="temp.content" :height="300" :width="750" />
        </el-form-item>
        <el-form-item label="课程价格">
          <el-input-number
            v-model="temp.price"
            size="normal"
            label="价格"
            :min="0"
            :step="1"
            :controls="true"
            controls-position="both"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="temp.status">
            <el-radio v-for="item in [0, 1]" :key="item" :label="item">
              {{ item === 0 ? '下架' : '上架' }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer text-center">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, createCourse, updateCourse, deleteCourse } from '@/api/course'
import Tinymce from '@/components/Tinymce'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const statusOptions = {
  0: '已下架',
  1: '已上架'
}

export default {
  name: 'MediaList',
  components: { Pagination, Tinymce },
  directives: { waves },
  filters: {
    statusFilter(status) {
      return statusOptions[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        title: undefined,
        status: undefined,
        page: 1,
        limit: 20,
        sort: '+id'
      },
      statusOptions,
      temp: {
        id: undefined,
        title: '',
        cover: '',
        price: 0,
        status: 1,
        try: '',
        content: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      rules: {
        title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
        try: [{ required: true, message: '试看内容不能为空', trigger: 'blur' }],
        content: [{ required: true, message: '课程内容不能为空', trigger: 'blur' }]
      },
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  computed: {
    getSortClass() {
      return this.listQuery.sort === '+id' ? 'ascending' : 'descending'
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取表格数据
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then((response) => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    // 排序
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
        this.handleFilter()
      } else if (order === 'descending') {
        this.listQuery.sort = '-id'
        this.handleFilter()
      }
    },
    // 重置表单
    resetTemp() {
      this.temp = {
        id: undefined,
        title: '',
        cover: '',
        price: 0,
        status: 1,
        try: '',
        content: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['tryContent'].setContent('')
        this.$refs['payContent'].setContent('')
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 新增
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createCourse(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['tryContent'].setContent(this.temp.try)
        this.$refs['payContent'].setContent(this.temp.content)
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 编辑
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateCourse(tempData).then(() => {
            const index = this.list.findIndex((v) => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // 删除
    handleDelete(row, index) {
      deleteCourse(row).then((response) => {
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
        this.list.splice(index, 1)
      })
    },
    handleUploadRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleUploadSuccess(response, file, fileList) {
      console.log(response, file, fileList)
    }
  }
}
</script>
<style lang="scss" scoped>
.filter-container {
  .ml-auto {
    margin-left: auto;
  }
  .filter-item {
    margin: 0 5px;
  }
}
.el-table {
  .cont {
    & > img {
      width: 100px;
      height: 50px;
    }
    & > div {
      margin-left: 10px;
      justify-content: space-between;
      .price {
        color: #ff0000;
      }
    }
  }
}
</style>
