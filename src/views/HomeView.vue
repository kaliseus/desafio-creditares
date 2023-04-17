<template>
    <div class="q-gutter-y-md column search-bar">
        <q-toolbar class="bg-primary text-white rounded-borders">
            <q-space />
            <q-input dark dense standout v-model="text" style="min-width: 98%" input-class="text-right" class="q-ml-lg-xs" @change="SearchAdress(this.text)">
                <template v-slot:append>
                    <q-icon v-if="text === ''" name="search"/>
                    <q-icon v-else name="clear" class="cursor-pointer" @click="text = ''" />
                </template>
            </q-input>
        </q-toolbar>
    </div>
    <register-adress-modal
        @some-event="getAdress"
    />
    <div id="cards" class="cards">
        <LocationCard
            @some-event="getAdress"
            v-for="(item, index) in adress"
            :index="index"
            :key="item"
            :name="item.name"
            :cep="item.cep"
            :uf="item.uf"
            :city="item.city"
            :neighborhood="item.neighborhood"
            :logradouro="item.logradouro"
            :number="item.number"
        />
    </div>
</template>

<script>
import LocationCard from "@/components/LocationCard.vue";
import RegisterAdressModal from "@/components/Register-adress-modal.vue";
export default {
    components: {
        RegisterAdressModal,
        LocationCard
    },
    data() {
        return{
            adress: [],
            text: ''
        }
    },
    methods: {
        getAdress: function () {
            this.adress = []
            if(localStorage.getItem('adress')) {
                this.adress = localStorage.getItem('adress')
                this.adress = JSON.parse(this.adress)
            }
        },
        SearchAdress: function (text) {
            const searchArray = this.adress.filter(function(obj) { return obj.cep === text || obj.logradouro === text});
            this.SetAdress(searchArray)
        },
        SetAdress: function (adress) {
            this.adress = adress
        }
    },
    mounted() {
        this.getAdress()
    }
}
</script>
<style scoped>
body {
    display: flex;
    place-items: center;
    align-items: center;
}
body{
    max-width: 90%;
}

@media (min-width: 414px) {
    display: grid;
    grid-template-columns: auto;
    padding: 0 2rem;
}
@media (min-width: 1100px) {
    .cards{
        display: grid;
        grid-template-columns: auto auto;
        padding: 0 2rem;
    }
}

@media (min-width: 1920px) {
    .cards{
        display: grid;
        grid-template-columns: auto auto auto;
        padding: 0 2rem;
    }
}
@media (min-width: 1337px){
}
</style>