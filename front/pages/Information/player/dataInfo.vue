<template>
    <v-container fluid grid-list-md class="control">
        <div class="title mb-3">{{ cardTitle }}</div>
        <v-data-table
            :headers="headers"
            :items="data"
            hide-actions
            class="elevation-1">
            <template slot="items" slot-scope="props">
                <td>{{ props.item.match_time }}</td>
                <td class="text-xs-right">
                    {{ props.item.gameText }}
                </td>
                <td class="text-xs-right">{{ props.item.score }}</td>                
                <td class="text-xs-right">{{ props.item.two_point_shot_per }}</td>
                <td class="text-xs-right">{{ props.item.three_point_shot_per }}</td>
                <td class="text-xs-right">{{ props.item.free_throw_per }}</td>
                <td class="text-xs-right">{{ props.item.rebound_total }}</td>
                <td class="text-xs-right">{{ props.item.dunk }}</td>
                <td class="text-xs-right">{{ props.item.block }}</td>
                <td class="text-xs-right">{{ props.item.steal }}</td>
                <td class="text-xs-right">{{ props.item.assist }}</td>
                <td class="text-xs-right">{{ props.item.foul }}</td>
                <td class="text-xs-right">{{ props.item.fouled }}</td>
                <td class="text-xs-right">{{ props.item.turnover }}</td>
            </template>
        </v-data-table>
    </v-container>
</template>
<script>
export default {
    name: 'data-info',
    props: ['data', 'cardTitle'],
    data() {
        return {
            headers: [
                { text: '时间', value: 'match_time', align:'center'},
                { text: '比赛', value: 'gameText', align:'center'},
                { text: '得分', value: 'score', align:'center'},
                { text: '两份（率）', value: 'two_point_shot_per', align:'center'},
                { text: '三分（率）', value: 'three_point_shot_per', align:'center'},
                { text: '罚球（率）', value: 'free_throw_per', align:'center'},
                { text: '篮板（前/后）', value: 'rebound_total', align:'center'},
                { text: '扣篮', value: 'dunk', align:'center'},
                { text: '盖帽', value: 'block', align:'center'},
                { text: '抢断', value: 'steal', align:'center'},
                { text: '助攻', value: 'assist', align:'center'},
                { text: '犯规', value: 'foul', align:'center'},
                { text: '被侵', value: 'fouled', align:'center'},
                { text: '失误', value: 'turnover', align:'center'}
            ]
        }
    },
    created() {
        this.data.forEach(element => {
            element.gameText = `${element.home_club_name} ${element.home_score} : ${element.guest_score} ${element.guest_club_name}`;
        });
    }
}
</script>
<style lang="stylus" scoped>

</style>

