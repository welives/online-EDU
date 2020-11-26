<template>
  <div class="app-container">
    <!-- 顶部工具栏 -->
    <div class="filter-container f-row">
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
      <div class="ml-auto">
        <!-- <el-select v-model="listQuery.type" placeholder="类型" clearable style="width: 90px" class="filter-item">
          <el-option v-for="(item, key) in typeOptions" :key="key" :label="item" :value="key" />
        </el-select> -->
        <el-select v-model="listQuery.status" placeholder="状态" clearable style="width: 90px" class="filter-item">
          <el-option v-for="(item, key) in statusOptions" :key="key" :label="item" :value="key" />
        </el-select>
        <el-input
          v-model="listQuery.title"
          placeholder="作品名"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
      </div>
    </div>

    <!-- 表格主体 -->
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
      <el-table-column label="基本信息" header-align="center" min-width="350">
        <template slot-scope="{ row }">
          <!-- <div class="info f-col">
            <span class="link-type" @click="handleUpdate(row)">{{ row.title }}</span>
            <span class="mr-10">{{ row.type }}</span>
          </div> -->
          <div class="info f-row">
            <img :src="row.cover" />
            <span class="link-type ml-10" @click="handleUpdate(row)">{{ row.title }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="100">
        <template slot-scope="{ row }">
          <el-tag :type="row.status ? 'success' : 'danger'">
            {{ statusOptions[row.status] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.create_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="250" class-name="small-padding fixed-width">
        <template slot-scope="{ row, $index }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-popconfirm class="ml-10" title="是否要删除这条数据？" @onConfirm="handleDelete(row, $index)">
            <el-button slot="reference" size="mini" type="danger">
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

    <!-- 表单主体 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="80px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="曲标题" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <!-- <el-form-item label="曲类型" prop="type">
          <el-select v-model="temp.type" placeholder="请选择">
            <el-option v-for="(item, index) in typeOptions" :key="index" :label="item" :value="item" />
          </el-select>
        </el-form-item> -->
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
        <el-form-item label="谱曲" size="normal" prop="resource">
          <el-upload drag action="https://jsonplaceholder.typicode.com/posts/">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
          </el-upload>
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
import { musicList, createMusic, updateMusic, deleteMusic } from '@/api/production'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const statusOptions = {
  0: '审核失败',
  1: '审核通过'
}
// const typeOptions = ['中国风', '乡村', '古典', '嘻哈', '摇滚', '流行', '爵士', '电子', '轻音乐']

export default {
  name: 'MusicList',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        title: undefined,
        status: undefined,
        // type: undefined,
        page: 1,
        limit: 20,
        sort: '+id'
      },
      statusOptions,
      // typeOptions,
      // 表单字段
      temp: {
        id: undefined,
        title: '',
        cover: '',
        // type: '',
        resource: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      // 表单验证规则
      rules: {
        title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
        // type: [{ required: true, message: '请选择曲类型', trigger: 'blur' }],
        resource: [{ required: true, message: '谱曲不能为空', trigger: 'blur' }]
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
      musicList(this.listQuery).then((response) => {
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
        // type: '',
        resource: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 新增
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createMusic(this.temp).then(() => {
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
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 编辑
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateMusic(tempData).then(() => {
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
      deleteMusic(row).then((response) => {
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
  .info {
    & > img {
      width: 100px;
      height: 50px;
    }
    .price {
      color: #ff0000;
    }
  }
}
</style>
