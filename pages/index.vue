<template>
  <div class="home">
    <h2>eaHR is a friendly of SMEs</h2>
    <ul>
      <li v-for="(question, index) in questions" :key="index">
        <div>
          <h6>{{index + 1}}. {{question.content}}</h6>
          <VideoRecord/>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import VideoRecord from "~/components/VideoRecord";
export default {
  data() {
    return {
      questions: [
        {content: 'Hãy nêu những hiểu biết của bạn về NodeJS'},
        {content: 'Mô tả cơ chế Event Loop trong JS'},
        {content: 'Ưu và nhược điểm của NoSQL vs SQL'},
        {content: 'Mô tả Life Cycle của VueJS'},
        {content: 'Mô tả Life Cycle của VueJS'},
        {content: 'Mô tả Life Cycle của VueJS'},
      ]
    }
  },
  components: {
    VideoRecord
  }
}
</script>
<style lang="scss" scoped>
.home {
  color :green;
  width: 1000px;
  margin: 0 auto;
  h2 {
    text-align: center;
    font-size: 30px;
  }
  ul {
    list-style-type: none;
    li {
      div {
        h6{
          margin-left: 5px;
          margin-bottom: 5px;
          font-size: 16px;
          color: red;
        }
      }
    }
  }
}
</style>
