<template>
    <div class="q-pa-md row items-start q-gutter-md">
        <q-card class="my-card bg-grey-8 text-white">
            <q-card-section class="text-subtitle1 text-left">
                <div class="text-h4 q-mb-md">{{name}}</div>
                <q-separator dark />
                <div class="text-subtitle1 q-pt-md">CEP: {{cep}}</div>
            </q-card-section>
            <q-card-section class="text-subtitle1 text-left">
                UF: {{uf}}
            </q-card-section>
            <q-card-section class="text-subtitle1 text-left">
                Cidade: {{city}}
            </q-card-section>
            <q-card-section class="text-subtitle1 text-left">
                Bairro: {{neighborhood}}
            </q-card-section>
            <q-card-section class="text-subtitle1 text-left">
                Logradouro: {{logradouro}}
            </q-card-section>
            <q-card-section class="text-subtitle1 text-left">
                Número: {{number}}
            </q-card-section>
            <q-separator dark/>

            <div class="flex q-pa-md q-gutter-xl justify-center">
                <q-btn push label="Editar" color="primary" class="" size="18px" @click="update = true"/>
                <q-btn push label="Excluir" color="negative" class="" size="18px"  @click="confirm = true"/>
            </div>


                <q-dialog v-model="update" persistent>
                    <q-card class="q-pa-lg-lg my-card">

                        <q-card-section class="">
                            <q-input filled v-model="adresData.name" class="q-mb-md" label="Nome"/>
                            <q-input filled mask="#####-###" v-model="adresData.cep" class="q-mb-md" label="CEP" @change="getAdressbyLocalStorage(adresData)"/>
                            <q-input filled v-model="adresData.uf" class="q-mb-md" label="Estado"/>
                            <q-input filled v-model="adresData.city" class="q-mb-md" label="Cidade"/>
                            <q-input filled v-model="adresData.neighborhood" class="q-mb-md" label="Bairro"/>
                            <q-input filled v-model="adresData.logradouro" class="q-mb-md" label="Logradouro"/>
                            <q-input filled v-model="adresData.number" class="q-mb-md" label="Número"/>
                        </q-card-section>

                        <q-separator  />

                        <q-card-actions align="right">
                            <q-btn
                                push
                                label="Salvar"
                                color="primary"
                                size="15px"
                                v-close-popup
                                @click="saveAdressFormArray(this.adresData)"
                            />
                            <q-btn
                                push
                                label="Cancelar"
                                color="negative"
                                size="15px"
                                v-close-popup
                                @click="copyProps"
                            />
                        </q-card-actions>
                    </q-card>
                </q-dialog>

            <q-card-actions align="center">
                    <q-dialog v-model="confirm" persistent>
                        <q-card class="q-pa-lg-lg delete-modal">
                            <q-card-section class="text-dark">
                                Tem certeza que deseja Excluir este Endereço?
                            </q-card-section>
                            <q-card-actions align="right">
                                <q-btn
                                    push
                                    label="Sim"
                                    color="primary"
                                    size="15px"
                                    v-close-popup
                                    @click="deleteAdress"
                                />
                                <q-btn
                                    push
                                    label="Cancelar"
                                    color="negative"
                                    size="15px"
                                    v-close-popup
                                />
                            </q-card-actions>
                        </q-card>
                    </q-dialog>
            </q-card-actions>
        </q-card>
    </div>
</template>

<script>
import axios from "axios";
import {useQuasar} from 'quasar';

export default {
    setup () {
        useQuasar()
    },
    data() {
        return {
            confirm:false,
            update: false,
            adresData: []
        }
    },
    emits: ['someEvent'],
    props: {
        index: {
            type: Number,
            required:false
        },
        uf: {
            type: String,
            required:false
        },
        name: {
            type: String,
            required:false
        },
        cep: {
            type: String,
            required: false
        },
        city: {
            type: String,
            required: false
        },
        neighborhood: {
            type: String,
            required:false
        },
        logradouro: {
            type: String,
            required:false
        },
        number: {
            type: String,
            required:false
        }
    },
    methods:{
        getCep: async function (cep) {
            try {
                if(cep.length < 9) return;
                const { uf, localidade, bairro, logradouro } = (await axios.get(`https://viacep.com.br/ws/${cep}/json/`)).data
                this.adresData.uf = uf
                this.adresData.city = localidade
                if(bairro.length === 0) {
                    this.adresData.neighborhood = ''
                } else {
                    this.adresData.neighborhood = bairro
                }
                if(logradouro.length === 0) {
                    this.adresData.logradouro = ''
                } else {
                    this.adresData.logradouro = logradouro
                }
                this.setAdressListFromStorage(this.adresData)
            }
            catch (e) {
                console.log(e)
                this.$q.notify({
                    message: "API de busaca indíponivel, por favor cadastre os dados manualmente",
                    color: "$negative"
                })
            }
        },
        deleteAdress: function () {
            const adress = this.getAdress()
            adress.splice(this.index, 1)
            this.saveAdressbyMethods(adress)

        },
        getAdress: function () {
            let adress = []
                adress = localStorage.getItem('adress')
                adress = JSON.parse(adress)
            return adress
        },
        saveAdressbyMethods: function (adressArray) {
            const adress = adressArray
            localStorage.setItem('adress', JSON.stringify(adress))
            this.$q.notify({
                message: "Endereço Apagado com sucesso",
                color: "positive"
            })
            this.$emit('someEvent')
        },
        saveAdress: function (adressArray) {
            const adress = adressArray
            localStorage.setItem('adress', JSON.stringify(adress))
            this.$q.notify({
                message: "Endereço salvo com sucesso",
                color: "positive"
            })
            this.$emit('someEvent')
        },
        copyProps: function () {
            this.adresData = Object.assign({}, this.$props)
        },
        saveAdressFormArray: function (adress) {
            const adressArray = this.getAdress(adress)
            adressArray.splice(this.index,1, this.adresData)
            this.saveAdress(adressArray)
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
    },
    mounted() {
        this.copyProps()
    }
}
</script>

<style  scoped>
.my-card {
    min-width: 320px;
    max-width: 450px;
}
.delete-modal{
    min-width: 320px;
    max-width: 450px;
    min-height: 10vh;
}

@media (min-width: 600px) and (max-width: 1099px){
    .my-card {
        min-width: 80vh;
        min-height: auto;
    }
    .delete-modal{
        min-width: 320px;
        max-width: 450px;
        min-height: 10vh;
    }
}

@media (min-width: 1100px) {
    .my-card {
        min-width: 50vh;
        min-height: auto;
    }
    .delete-modal{
        min-width: 320px;
        max-width: 450px;
        min-height: 10vh;
    }
}

@media (min-width: 1920px) {
    .my-card {
        min-width: 50vh;
        min-height: auto;
    }
    .delete-modal{
        min-width: 320px;
        max-width: 450px;
        min-height: 2vh;
    }
}
</style>