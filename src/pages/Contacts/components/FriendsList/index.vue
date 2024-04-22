<script setup lang="ts">
import UserItem from "@/pages/Contacts/components/FriendsList/userItem.vue";
import useFriendsStore from "@/stores/friendsStore.ts";
import {computed, onMounted, ref} from "vue";
import Scroller from '@/components/Scroller/index.vue'
import {FriendType} from "@/type/user";
import VirtualList from '@/components/VirtualList/index.vue'

const props = defineProps<{
    list: FriendType[],
    value: string
}>()
defineEmits<{
    (e: 'updateValue', value: string): void
}>()
const selectItem = ref<string>('')

onMounted(() => {
    selectItem.value = props.list.length?props.list[0].id:'-1'
})




</script>

<template>
    <div class="friends-list" style="overflow-y: hidden;">
            <TransitionGroup
                    name="list"
            >
                <UserItem
                        v-for="friend in list"
                        :key="friend.id"
                        :name="friend.username"
                        :message="friend.lastMessage"
                        :id="friend.id"
                        :remark="friend.remark"
                        :type="friend.type"
                        :class="{
                        'friend-item':true,
                        selected:value === friend.id
                    }"
                        @click="()=>{
                        $emit('updateValue',friend.id)
                    }"
                />
            </TransitionGroup>
    </div>
</template>

<style src="./index.scss" lang="scss" scoped></style>