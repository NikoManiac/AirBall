<template>
    <v-layout row>
        <v-flex xs12>
            <sub-header :subHeaderData="settingListArray"></sub-header>
            <article-card v-if="articleList" :articleListData="articleList"></article-card>
            <p v-else class="heading">暂无收藏文章</p>
        </v-flex>
    </v-layout>
</template>
<script>
import { mapState } from 'vuex';
import subHeader from '@/components/SubHeader';
import articleCard from '@/components/ArticleCard';
function setState(store) {
    store.dispatch('appShell/appHeader/setAppHeader', {
        isShowHeader: false
    });
    store.dispatch('global/setShellStyleControl', {
        header: 3,
        footr: 3
    });
}
export default {
    name: 'collection',
    data() {
        return {
            settingListArray: {
                title: '我的收藏',
                leftIcon: 'arrow_back'
            },
            articleList: []
        }
    },
    async created() {
        let res = await this.$http.get('/api/collection');
        if (res.data.status) {
            this.articleList = res.data.data;
        }
    },
    computed: {
        ...mapState('appSetting/appSettingList', [
            'settingList'
        ])
    },
    async asyncData({store, route}) {
        setState(store);
    },
    activated() {
        setState(this.$store);
    },
    methods: {

    },
    components: {
        'sub-header': subHeader,
        'article-card': articleCard
    }
  }
</script>
<style lang="stylus" scoped>
.setting-list
    border-bottom 1px solid rgb(220, 220, 200);
    padding 1rem
</style>
