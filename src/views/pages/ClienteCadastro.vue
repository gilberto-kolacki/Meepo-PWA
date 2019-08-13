<template>
    <div id="page-customers">

        <div class="vx-col w-full mb-base-button">
            <div class="btn-group centex">
                <vs-button class="w-full" size="small" @click="scrollMeTo('basico')">Básico</vs-button>
                <vs-button class="w-full" size="small" @click="scrollMeTo('contatos')">Contato</vs-button>
                <vs-button class="w-full" size="small" @click="scrollMeTo('endereco')">Endereço</vs-button>
            </div>
        </div>

        <div class="vx-col w-full mb-base-button" ref="basico">
            <vx-card title="Cadastro de cliente">
                <div class="my-6">
                    <div class="vx-row">
                        <div class="vx-col sm:w-1/2 w-full mb-2">
                            <div class="vs-component vs-con-input-label vs-input w-full vs-input-primary" v-on:keyup.enter="proximoCampo('nomeCliente')">
                                <label for="" class="vs-input--label">CNPJ/CPF*</label>
                                <div class="vs-con-input">
                                    <the-mask v-validate="'required'" id="cnpj" v-model="clienteEdit.cnpj" class="vs-inputx vs-input--input normal hasValue" :mask="['###.###.###-##', '##.###.###/####-##']" :masked="true" />
                                </div>
                                <span class="text-danger text-sm">{{ errors.first('cnpj') }}</span>
                            </div>
                        </div>
                        <div class="vx-col sm:w-1/2 w-full mb-2">
                            <vs-input v-validate="'required|alpha_spaces'" label="Nome*" id="nomeCliente" v-model="clienteEdit.nome" class="w-full" v-on:keyup.enter="proximoCampo('razaoSocial')" />
                            <span class="text-danger text-sm">{{ errors.first('nome') }}</span>
                        </div>
                    </div>

                    <div class="vx-row">
                        <div class="vx-col sm:w-1/2 w-full mb-2">
                            <vs-input v-validate="'required|alpha_spaces'" label="Razão Social*" id="razaoSocial" v-model="clienteEdit.razaoSocial" class="w-full" />
                            <span class="text-danger text-sm">{{ errors.first('razaoSocial') }}</span>
                        </div>
                        <div class="vx-col sm:w-1/2 w-full mb-2" v-if="isJuridico">
                            <label for="" class="vs-input--label">Data Fundação*</label>                            
                            <datepicker placeholder="Selecione..." v-model="clienteEdit.dataFundacao" format="dd/MM/yyyy" :language="langSettings" id="dataFundacao" wrapper-class="w-full" input-class="vs-inputx vs-input--input normal"></datepicker>
                        </div>
                        <div class="vx-col sm:w-1/2 w-full mb-2" v-else>
                            <label for="" class="vs-input--label">Data Aniversário*</label>                            
                            <datepicker placeholder="Selecione..." v-model="clienteEdit.dataAniversario" format="dd/MM/yyyy" :language="langSettings" wrapper-class="w-full" input-class="vs-inputx vs-input--input normal"></datepicker>
                        </div>
                    </div>

                    <div class="vx-row">
                        <div class="vx-col sm:w-1/2 w-full mb-2" v-if="isJuridico">
                            <vs-input v-validate="'required|alpha_spaces'" label="Inscrição Estadual*" name="inscricaoEstadual" v-model="clienteEdit.inscricaoEstadual" class="w-full" />
                            <span class="text-danger text-sm">{{ errors.first('inscricaoEstadual') }}</span>
                        </div>
                        <div class="vx-col sm:w-1/2 w-full mb-2" v-else>
                            <vs-input v-validate="'required|alpha_spaces'" label="RG*" id="registroGeral" v-model="clienteEdit.dataNascimento" class="w-full" />
                            <span class="text-danger text-sm">{{ errors.first('rg') }}</span>
                        </div>
                        <div class="vx-col sm:w-1/2 w-full mb-2">
                            <label for="segmento" class="vs-input--label">Segmento*</label>
                            <v-select id="segmento" :options="segmentos"></v-select>
                        </div>
                    </div>
                    <div class="vx-row">
                        <div class="vx-col sm:w-1/2 w-full mb-2">
                            <vs-input v-validate="'required|email'" label="E-mail*" id="email" v-model="clienteEdit.email" class="w-full" type="email" />
                            <span class="text-danger text-sm">{{ errors.first('email') }}</span>
                        </div>
                        <div class="vx-col sm:w-1/2 w-full mb-2">
                            <label for="" class="vs-input--label">Grupo de Clientes*</label>
                            <v-select :options="grupoClientes"></v-select>
                        </div>
                    </div>
                    <div class="vx-row">
                        <div class="vx-col w-full mb-2">
                            <label for="" class="vs-input--label">Referencias Comerciais</label>
                            <vs-textarea v-model="clienteEdit.referenciaComercial"/>
                        </div>
                    </div>
                    <div class="vx-row">
                        <div class="vx-col w-full mb-2">
                            <label for="" class="vs-input--label">Observações</label>
                            <vs-textarea v-model="clienteEdit.observacao"/>
                        </div>
                    </div>
                    <div class="vx-row">
                        <div class="vx-col w-full mb-2">
                            <div class="con-upload">
                                <div class="con-img-upload" ref="customer-images">
                                    <div class="img-upload" v-for="(imagenCliente, index) in getFilesFilter" :key="`imagem-cliente-${index}`">
                                        <button class="btn-x-file" @click="removeImageCliente(index)">
                                            <i translate="translate" class="material-icons notranslate">clear</i>
                                        </button>
                                        <img :src="imagenCliente.src" style="max-width: none; max-height: 100%;" />
                                    </div>
                                    <div class="con-input-upload">
                                        <input type="file" multiple="multiple" accept="image/*" @change="onFileChanged" :disabled="imagensCliente.length >= 5"/>
                                        <span class="text-input">Selecione as Imagens</span>                                
                                        <button type="button" title="Upload" class="btn-upload-all vs-upload--button-upload" :disabled="imagensCliente.length >= 5">
                                            <i translate="translate" class="material-icons notranslate">cloud_upload</i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="vx-row">
                        <div class="vx-col my-5-top w-full">
                            <vs-button color="success" class="mr-3 mb-2 pull-right" @click="salvarCliente">Salvar</vs-button>
                            <vs-button color="danger" type="border" class="mb-2 pull-right" @click="cancelarCliente">Cancelar</vs-button>
                        </div>
                    </div>
                </div>
            </vx-card>
        </div>
        <div class="vx-col w-full mb-base-button" ref="contatos">
            <vx-card title="Contato">
                <div id="cliente-contato-edit" v-if="isEditContato">
                    <div class="my-1">
                        <div class="vx-row">
                            <div class="vx-col sm:w-1/2 w-full mb-2">
                                <vs-input v-validate="'required|alpha_spaces'" label="Nome Contato*" id="nomeContato" v-model="contatoEdit.nome" class="w-full" v-on:keyup.enter="proximoCampo('funcao')"/>
                                <span class="text-danger text-sm">{{ errors.first('nomeContato') }}</span>
                            </div>
                            <div class="vx-col sm:w-1/2 w-full mb-2">
                                <vs-input v-validate="'required|alpha_spaces'" label="Função*" id="funcao" v-model="contatoEdit.funcao" class="w-full" v-on:keyup.enter="proximoCampo('telefone')"/>
                                <span class="text-danger text-sm">{{ errors.first('funcao') }}</span>
                            </div>
                        </div>
                        <div class="vx-row">
                            <div class="vx-col sm:w-1/2 w-full mb-2">
                                <div class="vs-component vs-con-input-label vs-input w-full vs-input-primary" v-on:keyup.enter="proximoCampo('celular')">
                                    <label for="" class="vs-input--label">Telefone*</label>
                                    <div class="vs-con-input">
                                        <the-mask v-validate="'required'" type="tel" id="telefone" v-model="contatoEdit.telefone" class="vs-inputx vs-input--input normal hasValue" :mask="['(##) ####-####', '(##) #####-####']" :masked="true"/>
                                    </div>
                                    <span class="text-danger text-sm">{{ errors.first('telefone') }}</span>
                                </div>
                            </div>
                            <div class="vx-col sm:w-1/2 w-full mb-2">
                                <div class="vs-component vs-con-input-label vs-input w-full vs-input-primary" v-on:keyup.enter="proximoCampo('emailContato')">
                                    <label for="" class="vs-input--label">Celular*</label>
                                    <div class="vs-con-input">
                                        <the-mask v-validate="'required'" type="tel" id="celular" v-model="contatoEdit.celular" class="vs-inputx vs-input--input normal hasValue" :mask="['(##) ####-####', '(##) #####-####']" :masked="true"/>
                                    </div>
                                    <span class="text-danger text-sm">{{ errors.first('telefone') }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="vx-row">
                            <div class="vx-col sm:w-1/2 w-full mb-2">
                                <vs-input v-validate="'required|email'" label="E-mail*" id="emailContato" v-model="contatoEdit.email" class="w-full" type="email" />
                                <span class="text-danger text-sm">{{ errors.first('email') }}</span>
                            </div>
                        </div>
                         <div class="vx-row">
                            <div class="vx-col my-5-top w-full">
                                <vs-button color="success" class="mr-3 mb-2 pull-right" @click="salvarContato">Salvar</vs-button>
                                <vs-button color="danger" type="border" class="mb-2 pull-right" @click="cancelarContato">Cancelar</vs-button>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="cliente-contato-list" v-else>
                    <vs-table max-items="5" :data="clienteEdit.contatos">            
                        <template slot="header">
                            <div class="my-5">
                                <vs-button type="filled" icon-pack="feather" icon="icon-plus" @click="editarContato(null)">Novo</vs-button>
                            </div>
                        </template>
                        <template slot="thead">
                            <vs-th sort-key="nome">Nome</vs-th>
                            <vs-th sort-key="nome">Função</vs-th>
                            <vs-th sort-key="contato">Telefone</vs-th>
                            <vs-th sort-key="telefone">celular</vs-th>
                            <vs-th sort-key="telefone">E-mail</vs-th>
                            <vs-th>Ações</vs-th>
                        </template>
                        <template slot-scope="{data}">
                            <vs-tr :state="data[indextr].ativo === false ? 'danger' :null" :key="indextr" v-for="(tr, indextr) in data">
                                <vs-td :data="data[indextr].nome">
                                    {{ data[indextr].nome }}
                                </vs-td>
                                <vs-td :data="data[indextr].funcao">
                                    {{ data[indextr].funcao }}
                                </vs-td>
                                <vs-td :data="data[indextr].telefone">
                                    {{ data[indextr].telefone }}
                                </vs-td>
                                <vs-td :data="data[indextr].celular">
                                    {{ data[indextr].celular }}
                                </vs-td>
                                <vs-td :data="data[indextr].email">
                                    {{ data[indextr].email }}
                                </vs-td>
                                <vs-td>
                                    <div class="flex">
                                        <div class="p-1">
                                            <vs-button type="filled" size="small" name="Editar" icon-pack="feather" color="warning" icon="icon-edit-2" @click="editarContato(data[indextr])" />
                                        </div>
                                        <div class="p-1">
                                            <vs-button type="filled" size="small" icon-pack="feather" color="danger" icon="icon-x" @click="deletarContato(data[indextr])"/>
                                        </div>
                                    </div>
                                </vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>
                </div>
            </vx-card>
        </div>
        <div class="vx-col w-full mb-base-button" ref="endereco">
            <vx-card title="Endereço">
                <div id="cliente-endereco-edit" v-if="isEditEndereco">
                    <div class="my-1">
                        <div class="vx-row">
                            <div class="vx-col sm:w-1/4 w-full mb-2">
                                <vs-input v-validate="'required|alpha_spaces'" label="CEP*" id="cep" v-model="enderecoEdit.cep" class="w-full" v-on:keyup.enter="proximoCampo('endereco')"/>
                                <span class="text-danger text-sm">{{ errors.first('cep') }}</span>
                            </div>
                            <div class="vx-col sm:w-3/4 w-full mb-2">
                                <vs-input label="Endereço*" id="endereco" v-model="enderecoEdit.endereco" class="w-full" v-on:keyup.enter="proximoCampo('numeroEndereco')"/>                                
                            </div>
                        </div>.
                        <div class="vx-row">
                            <div class="vx-col sm:w-1/6 w-full mb-2">
                                <vs-input label="Numero*" id="numeroEndereco" v-model="enderecoEdit.numero" class="w-full" v-on:keyup.enter="proximoCampo('complemento')"/>
                            </div>
                            <div class="vx-col sm:w-1/2 w-full mb-2">
                                <vs-input v-validate="'required|alpha_spaces'" label="Complemento*" id="complemento" v-model="enderecoEdit.complemento" class="w-full" v-on:keyup.enter="proximoCampo('bairro')"/>
                                <span class="text-danger text-sm">{{ errors.first('complemento') }}</span>
                            </div>
                            <div class="vx-col sm:w-1/3 w-full mb-2">
                                <vs-input v-validate="'required|alpha_spaces'" label="Bairro*" id="bairro" v-model="enderecoEdit.bairro" class="w-full" v-on:keyup.enter="proximoCampo('cidade')"/>
                                <span class="text-danger text-sm">{{ errors.first('bairro') }}</span>
                            </div>
                        </div>
                        <div class="vx-row">
                            <div class="vx-col sm:w-1/2 w-full mb-2">
                                <vs-input v-validate="'required|alpha_spaces'" label="Cidade*" id="cidade" v-model="enderecoEdit.cidade" class="w-full" v-on:keyup.enter="proximoCampo('estado')"/>
                                <span class="text-danger text-sm">{{ errors.first('nomeContato') }}</span>
                            </div>
                            <div class="vx-col sm:w-1/6 w-full mb-2">
                                <vs-input v-validate="'required|alpha_spaces'" label="Estado*" id="estado" v-model="enderecoEdit.estado" class="w-full" v-on:keyup.enter="proximoCampo('enderecoTelefone')"/>
                                <span class="text-danger text-sm">{{ errors.first('complemento') }}</span>
                            </div>
                            <div class="vx-col sm:w-1/3 w-full mb-2">
                                <div class="vs-component vs-con-input-label vs-input w-full vs-input-primary">
                                    <label for="" class="vs-input--label">Telefone*</label>
                                    <div class="vs-con-input">
                                        <the-mask v-validate="'required'" type="tel" id="enderecoTelefone" v-model="enderecoEdit.telefone" class="vs-inputx vs-input--input normal hasValue" :mask="['(##) ####-####', '(##) #####-####']" :masked="true"/>
                                    </div>
                                    <span class="text-danger text-sm">{{ errors.first('telefone') }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="vx-row">
                            <div class="vx-col my-5-top w-full">
                                <vs-button color="success" class="mr-3 mb-2 pull-right" @click="salvarEndereco">Salvar</vs-button>
                                <vs-button color="danger" type="border" class="mb-2 pull-right" @click="cancelarEndereco">Cancelar</vs-button>
                            </div>
                        </div>                        
                    </div>                    
                </div>
                <div id="cliente-endereco-list" v-else>
                    <vs-table max-items="5" :data="clienteEdit.enderecos">            
                        <template slot="header">
                            <div class="my-5">
                                <vs-button type="filled" icon-pack="feather" icon="icon-plus" @click="editarEndereco(null)">Novo</vs-button>
                            </div>
                        </template>
                        <template slot="thead">
                            <vs-th sort-key="cep">CEP</vs-th>
                            <vs-th sort-key="endereco">Endereço</vs-th>
                            <vs-th sort-key="numero">Numero</vs-th>
                            <vs-th sort-key="bairro">Bairro</vs-th>
                            <vs-th sort-key="cidade">Cidade</vs-th>
                            <vs-th sort-key="estado">UF</vs-th>
                            <vs-th sort-key="telefone">Telefone</vs-th>
                            <vs-th>Ações</vs-th>
                        </template>
                        <template slot-scope="{data}">
                            <vs-tr :state="data[indextr].ativo === false ? 'danger' :null" :key="indextr" v-for="(tr, indextr) in data">
                                <vs-td :data="data[indextr].cep">
                                    {{ data[indextr].cep }}
                                </vs-td>
                                <vs-td :data="data[indextr].endereco">
                                    {{ data[indextr].endereco }}
                                </vs-td>
                                <vs-td :data="data[indextr].numero">
                                    {{ data[indextr].numero }}
                                </vs-td>
                                <vs-td :data="data[indextr].bairro">
                                    {{ data[indextr].bairro }}
                                </vs-td>
                                <vs-td :data="data[indextr].cidade">
                                    {{ data[indextr].cidade }}
                                </vs-td>
                                <vs-td :data="data[indextr].estado">
                                    {{ data[indextr].estado }}
                                </vs-td>
                                <vs-td :data="data[indextr].telefone">
                                    {{ data[indextr].telefone }}
                                </vs-td>
                                <vs-td>
                                    <div class="flex">
                                        <div class="p-1">
                                            <vs-button type="filled" size="small" name="Editar" icon-pack="feather" color="warning" icon="icon-edit-2" @click="editar(data[indextr])" />
                                        </div>
                                        <div class="p-1" v-if="data[indextr].ativo">
                                            <vs-button type="filled" size="small" icon-pack="feather" color="success" icon="icon-unlock" @click="inativar(data[indextr])"/>
                                        </div>
                                        <div class="p-1" v-else>
                                            <vs-button type="filled" size="small" icon-pack="feather" color="danger" icon="icon-lock" @click="ativar(data[indextr])"/>
                                        </div>
                                    </div>
                                </vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>
                </div>
            </vx-card>
        </div>
    </div>
</template>

<script>

import { Validator } from 'vee-validate';
import Datepicker from 'vuejs-datepicker';
import * as lang from "vuejs-datepicker/src/locale";
import vSelect from 'vue-select';
import _ from 'lodash'

const dict = {
    custom: {
        email: {
            required: 'Campo obrigatório!',
            email: 'O campo deve ser um e-mail válido.'
        },
        cnpj: {
            required: 'Campo obrigatório!',
            cnpj: 'CNPJ inválido',
        },
        nome: {
            required: 'Campo obrigatório!',
            alpha_spaces: 'O campo deve conter apenas Letras.'
        },
        razaoSocial: {
            required: 'Campo obrigatório!',
            alpha_spaces: 'O campo deve conter apenas Letras.'
        },
        contato: {
            required: 'Campo obrigatório!',
            alpha_spaces: 'O campo deve conter apenas Letras.'
        },
        telefone: {
            required: 'Campo obrigatório!',
        },
    }
};

Validator.localize('pt', dict);

export default {
    data() {
        return {        
            clienteEdit: {
                contatos: [],
                enderecos: [],
            },
            contatoEdit: {},
            enderecoEdit: {},
            isJuridico: true,
            isEditContato: false,
            isEditEndereco: false,
            langSettings: lang.ptBR,
            segmentos: ['foo','bar'],
            grupoClientes: [],
            imagensCliente: [],
        }
    },
    components: {
        Datepicker,        
        'v-select': vSelect,
    },
    computed:{
        getFilesFilter() {
            let files = this.imagensCliente.filter((item) => {
                return !item.remove
            })
            return files
        },
    },
    methods: {
        scrollMeTo(refName) {
            var element = this.$refs[refName];
            var top = element.offsetTop;
            window.scrollTo(0, top);
        },
        proximoCampo(refName) {           
            document.getElementById(refName).focus();            
        },
        toBase64(file) {
            return new Promise((resolve) => {
                var reader = new FileReader();
                reader.onload = function(readerEvt) {
                    var binaryString = readerEvt.target.result;
                    var binaryString64 = "data:image/png;base64,";
                    binaryString64 = binaryString64.concat(window.btoa(binaryString));
                    resolve(binaryString64);
                };
                reader.readAsBinaryString(file);
            });
        },
        onFileChanged(event) {            
            const imagens = _.cloneDeep(this.imagensCliente);
            const files = event.target.files;
            if (files.length > 0) {
                this.$vs.loading();
                for (let index = 0; index < 5; index++) {
                    this.toBase64(files[index]).then(result => {
                        var image = {};
                        image.index = index;
                        image.src = result;
                        imagens.push(image);
                    });
                }
                this.imagensCliente = imagens;
                setTimeout(() => {
                    this.$vs.loading.close();                
                }, 1500)
            }
        },
        removeImageCliente(index) {
            for( var i = 0; i < this.imagensCliente.length; i++){ 
                if (this.imagensCliente[i] === this.imagensCliente[index]) {
                    this.imagensCliente.splice(i, 1); 
                }
            }
        },
        editarContato(contato) {
            this.isEditContato = true;
            if (contato === null) {
                this.contatoEdit = {};
            } else {
                this.contatoEdit = contato;
            }
            setTimeout(() => {
                this.proximoCampo('nomeContato');
            }, 100);
        },
        editarEndereco(endereco) {
            this.isEditEndereco = true;
            if (endereco === null) {
                this.enderecoEdit = {};
            } else {
                this.enderecoEdit = endereco;
            }
            setTimeout(() => {
                this.proximoCampo('cep');
            }, 100);
        },
        cancelarContato() {
            this.isEditContato = false;
        },
        cancelarEndereco() {
            this.isEditEndereco = false;
        },
        salvarContato() {
            this.clienteEdit.contatos.push(_.clone(this.contatoEdit));
            this.isEditContato = false;
        },
        salvarEndereco() {

        },
        
    },
    
    mounted() {
        setTimeout(() => {
            this.proximoCampo('cnpj');
        }, 100);
        
    }
}

</script>

<style>

.mb-base-button {
    margin-bottom: 0.8rem !important;
}

.centex {
    display: -ms-flexbox;
    display: -webkit-box;
    display: flex;
    -ms-flex-align: center;
    -webkit-box-align: center;
    align-items: center;
    -ms-flex-pack: center;
    -webkit-box-pack: center;
    justify-content: center;
}

.con-img-upload .img-upload {
    width: 185px;
    height: 185px;
}

.my-5-top {
    margin-top: 1.25rem !important;    
}

</style>
