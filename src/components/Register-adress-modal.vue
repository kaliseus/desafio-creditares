<template>
    <div class="text-right q-pr-xl q-py-md button-register">
        <q-btn align="center" label="Novo Endereço" color="primary" size="20px" @click="confirm = true" />
    </div>
    <div class="q-pa-md q-gutter-sm">
        <q-dialog v-model="confirm" persistent>
            <q-card class="q-pa-lg-lg card">

                <q-card-section class="">
                    <q-input filled v-model="form.name" class="q-mb-md" label="Nome"/>
                    <q-input filled mask="#####-###" v-model="form.cep" class="q-mb-md" label="CEP" @change="getAdressbyLocalStorage(form)"/>
                    <q-input filled v-model="form.uf" class="q-mb-md" label="Estado"/>
                    <q-input filled v-model="form.city" class="q-mb-md" label="Cidade"/>
                    <q-input filled v-model="form.neighborhood" class="q-mb-md" label="Bairro"/>
                    <q-input filled v-model="form.logradouro" class="q-mb-md" label="Logradouro"/>
                    <q-input filled v-model="form.number" class="q-mb-md" label="Número"/>
                </q-card-section>

                <q-separator  />


                <q-card-actions align="center">
                    <div class="flex q-pa-md q-gutter-xl justify-center">
                    <q-btn
                        push
                        label="Salvar"
                        color="primary"
                        size="20px"
                        v-close-popup
                        @click="saveAdress(this.form)"
                    />
                    <q-btn
                        push
                        label="Cancelar"
                        color="negative"
                        size="20px"
                        v-close-popup
                        @click="clearForm"
                    />
                    </div>
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>

<script>
import { ref } from 'vue'
import axios from "axios";
import {useQuasar} from 'quasar';
export default {
    setup () {
        useQuasar()
    },
    name: "Register-adress-modal",
    data() {
        return {
            confirm: ref(false),
            form: {
                name: '',
                cep: '',
                uf: '',
                city: '',
                neighborhood: '',
                logradouro: '',
                number: ''
            }
        }
    },
    emits: ['someEvent'],
    methods:{
        getCep: async function getCep (cep) {
            try {
                if(cep.length < 9) return;
                const { uf, localidade, bairro, logradouro } = (await axios.get(`https://viacep.com.br/ws/${cep}/json/`)).data
                this.form.uf = uf
                this.form.logradouro = logradouro
                this.form.neighborhood = bairro
                this.form.city = localidade
                this.setAdressListFromStorage(this.form)
            }
            catch (e) {
                console.log(e)
                this.$q.notify({
                    message: "API de busaca indíponivel, por favor cadastre os dados manualmente",
                    color: "$negative"
                })
            }
        },
        clearForm: function () {
            Object.assign(this.$data, this.$options.data.call(this));
        },
        saveAdress: function (form) {
            let adress = []
            if(localStorage.getItem('adress')){
                adress = localStorage.getItem('adress')
                adress = JSON.parse(adress)
            }
            adress.push(form)
            localStorage.setItem('adress', JSON.stringify(adress))
            this.$q.notify({
                message: "Endereço salvo com sucesso",
                color: "positive"
            })
            this.$emit('someEvent')
            this.clearForm()
        },
        setAdressListFromStorage:function (form) {
            let adressTolocal = []
            if(localStorage.getItem('adressList')){
                adressTolocal = localStorage.getItem('adressList')
                adressTolocal = JSON.parse(adressTolocal)
            }
            const adress = adressTolocal.filter(function(obj) { return obj.cep === form.cep})
            if(adress.length > 0) return
            adressTolocal.push(form)
            localStorage.setItem('adressList', JSON.stringify(adressTolocal))
        },
        getAdressbyLocalStorage: function (form) {
            let adressToLocalStorage = []
            if(localStorage.getItem('adressList')){
                adressToLocalStorage = localStorage.getItem('adressList')
                adressToLocalStorage = JSON.parse(adressToLocalStorage)
            }
            if(form.cep.length < 9) return;
            const searchArray = adressToLocalStorage.filter(function(obj) { return obj.cep === form.cep});
            if(searchArray.length > 0) {
                form.uf = searchArray[0].uf
                form.logradouro = searchArray[0].logradouro
                form.neighborhood = searchArray[0].neighborhood
                form.city = searchArray[0].city
            }
            else {
                this.getCep(form.cep)
            }
        }
    }
}
</script>
<style scoped>

@media (min-width: 1337px) {
    .card {
        width: 35vw;
        height: auto;
    }
}

@media (min-width: 1920px) {
    .card {
        width: 60vh;
        height: auto;
    }
}

@media (min-width: 414px) and (max-width: 600px)
.card {
    width: 90vw;
    height: auto;
}

</style>