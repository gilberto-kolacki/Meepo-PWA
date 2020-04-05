<template>
    <div id="page-customer">
        <div class="vx-col w-full mb-base-button">
            <div class="btn-group centex">
                <vs-button class="w-full" size="small" @click="scrollMeTo('enderecoCobranca')">Endereço de Cobrança</vs-button>
                <vs-button class="w-full" size="small" @click="scrollMeTo('contatos')">Contato</vs-button>
                <vs-button class="w-full" size="small" @click="scrollMeTo('endereco')">Endereço de Entrega</vs-button>
            </div>
        </div>
        <div class="vx-col w-full mb-base-button" ref="basico">
            <vx-card title="Cadastro de cliente">
                <div class="my-6">
                    <div class="vx-row">
                        <div class="vx-col sm:w-1/4 w-full mb-2">
                            <!-- <div class="vs-component vs-con-input-label vs-input w-full vs-input-primary" v-on:keyup.enter="isJuridico ? proximoCampo('razaoSocial') : proximoCampo('nomeCliente')"> -->
                            <div class="vs-component vs-con-input-label vs-input w-full vs-input-primary" v-on:keyup.enter="isJuridico ? proximoCampo('razaoSocial') : proximoCampo('nomeCliente')">
                                <label for="" class="vs-input--label">CPF/CNPJ*</label>
                                <div class="vs-con-input">
                                    <the-mask v-validate="'required|min:14'" :disabled="this.$route.params.clienteId" @input="verificaCnpjClienteNovo(cpfCnpj)" id="cpfCnpj" name="cpfCnpj" v-model="cpfCnpj" class="vs-inputx vs-input--input normal hasValue" :mask="['###.###.###-##', '##.###.###/####-##']" :masked="true" />
                                </div>
                                <span class="text-danger text-sm">{{ errors.first('cpfCnpj') }}</span>
                                <span v-if="idExistente" class="text-danger text-sm">{{ isJuridico ? 'O CNPJ já existe na base de dados!' : 'O CPF já existe na base de dados!' }}</span>
                            </div>
                        </div>
                        <div v-if="isJuridico" class="vx-col sm:w-3/4 w-full mb-2" v-on:keyup.enter="proximoCampo('fantasia')">
                            <vs-input v-validate="'required'" :disabled="this.clienteEdit.clienteErp" label="Razão Social*" @input="cnpjnulo(cpfCnpj,'razaoSocial')" id="razaoSocial" name="razaoSocial" v-model="clienteEdit.razaoSocial" class="w-full" />
                            <span class="text-danger text-sm">{{ errors.first('razaoSocial') }}</span>
                        </div>
                        <div v-else class="vx-col sm:w-3/4">
                            <div v-on:keyup.enter="proximoCampo('dataAniversario')">
                                <vs-input v-validate="'required'" :disabled="this.clienteEdit.clienteErp" @input="cnpjnulo(cpfCnpj,'nome')" label="Nome*" id="nomeCliente" name="nomeCliente" v-model="clienteEdit.nome" class="w-full" />
                                <span class="text-danger text-sm" v-if="errors.has('nomeCliente')">{{ errors.first('nomeCliente') }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="vx-row" v-if="isJuridico">
                        <div class="vx-col w-full mb-2" v-on:keyup.enter="proximoCampo('dataFundacao')">
                            <vs-input @input="cnpjnulo(cpfCnpj,'nomeFantasia')" v-validate=" isJuridico ? 'required' : ''" :disabled="this.clienteEdit.clienteErp" label="Fantasia*" id="fantasia" name="fantasia" v-model="clienteEdit.nomeFantasia" class="w-full" />
                            <span class="text-danger text-sm">{{ errors.first('fantasia') }}</span>
                        </div>
                    </div>
                    <!-- ---- -->
                    <div class="vx-row">
                        <div class="vx-col sm:w-1/4 w-full mb-2" v-on:keyup.enter="proximoCampo('emailNfe')">
                            <div v-if="isJuridico" class="vs-component vs-con-input-label vs-input w-full vs-input-primary">
                                <label for="" class="vs-input--label">Data Fundação*</label>
                                <div class="vs-con-input">
                                    <the-mask
                                        @input="cnpjnulo(cpfCnpj,'dataFundacao')"
                                        v-validate="'required|min:8'" 
                                        :disabled="this.clienteEdit.clienteErp"
                                        class="vs-inputx vs-input--input normal hasValue" 
                                        :mask="['##/##/####']" 
                                        :masked="true"
                                        placeholder="DD/MM/AAAA" 
                                        v-model="clienteEdit.dataFundacao" 
                                        id="dataFundacao" 
                                        name="dataFundacao" 
                                        ref="dataFundacao" 
                                    />
                                </div>
                                <span class="text-danger text-sm">{{ errors.first('cpfCnpj') }}</span>
                            </div>
                            <div v-else class="vs-component vs-con-input-label vs-input w-full vs-input-primary">
                                <label for="" class="vs-input--label">Data Aniversário*</label>
                                <div class="vs-con-input">
                                    <the-mask
                                        @input="cnpjnulo(cpfCnpj,'dataAniversario')" 
                                        v-validate="'required|min:8'"
                                        :disabled="this.clienteEdit.clienteErp"
                                        class="vs-inputx vs-input--input normal hasValue" 
                                        :mask="['##/##/####']" 
                                        :masked="true"
                                        placeholder="DD/MM/AAAA" 
                                        v-model="clienteEdit.dataAniversario" 
                                        id="dataAniversario"
                                        name="dataAniversario"
                                        ref="dataAniversario" 
                                    />
                                </div>
                                <span class="text-danger text-sm">{{ errors.first('cpfCnpj') }}</span>
                            </div>
                        </div>
                        <div class="vx-col sm:w-1/4 w-full mb-2" v-if="isJuridico">
                            <div class="vs-component vs-con-input-label vs-input w-full vs-input-primary" v-on:keyup.enter="proximoCampo('emailNfe')">
                                <vs-input @input="cnpjnulo(cpfCnpj)" v-validate="clienteEdit.clienteErp ? 'required':''" :disabled="this.clienteEdit.clienteErp" label="Inscrição Estadual*" id="inscricaoEstadual" name="inscricaoEstadual" v-model="clienteEdit.inscricaoEstadual" class="w-full" />
                                <span class="text-danger text-sm">{{ errors.first('inscricaoEstadual') }}</span>
                            </div>
                        </div>
                        <div v-if="isJuridico" class="vx-col sm:w-1/2 w-full mb-2" v-on:keyup.enter="proximoCampo('emailNfe')">
                            <div class="vs-component vs-con-input-label vs-input w-full vs-input-primary">
                                <label for="" class="vs-input--label">Segmentos*</label>
                                <v-select 
                                    id="segmento"
                                    name="segmento"
                                    :disabled="(this.clienteEdit.clienteErp) ? true : false"
                                    :options="this.getSegmentosCheckBox"
                                    multiple
                                    v-model="segmentosCliente" 
                                    @input="cnpjnulo(cpfCnpj)">
                                </v-select>
                                <span class="text-danger text-sm">{{ errors.first('segmento') }}</span>
                            </div>
                        </div>
                        <div v-else class="vx-col sm:w-3/4 w-full mb-2" v-on:keyup.enter="proximoCampo('emailNfe')">
                            <div class="vs-component vs-con-input-label vs-input w-full vs-input-primary">
                                <label for="" class="vs-input--label">Segmentos*</label>
                                <v-select 
                                    id="segmento"
                                    name="segmento"
                                    :disabled="(this.clienteEdit.clienteErp) ? true : false"
                                    :options="this.getSegmentosCheckBox"
                                    multiple
                                    v-model="segmentosCliente" 
                                    @input="cnpjnulo(cpfCnpj)">
                                </v-select>
                                <span class="text-danger text-sm">{{ errors.first('segmento') }}</span>
                            </div>
                        </div>
                    </div>
                    <!-- ---- -->
                    <div class="vx-row">
                        <div class="vx-col sm:w-1/2 w-full mb-2" v-on:keyup.enter="proximoCampo('enderecoTelefone')">
                            <vs-input @input="cnpjnulo(cpfCnpj,'emailNfe')" v-validate="'required|email'" :disabled="this.clienteEdit.clienteErp" label="E-mail NFe*" id="emailNfe" name="emailNfe" v-model="clienteEdit.emailNfe" class="w-full" type="email" />
                            <span class="text-danger text-sm">{{ errors.first('emailNfe') }}</span>
                        </div>
                        <div class="vx-col sm:w-1/2 w-full mb-2" v-on:keyup.enter="proximoCampo('cepEndereco')">
                            <div class="vs-component vs-con-input-label vs-input w-full vs-input-primary">
                                <label for="" class="vs-input--label">Telefone*</label>
                                <div class="vs-con-input">
                                    <the-mask @input="cnpjnulo(cpfCnpj,'endereco')" v-validate="'required'" :disabled="this.clienteEdit.clienteErp" type="tel" id="enderecoTelefone" name="enderecoTelefone" v-model="clienteEdit.endereco.telefone" class="vs-inputx vs-input--input normal hasValue" :mask="['(##) ####-####', '(##) #####-####']" :masked="true"/>
                                </div>
                                <span class="text-danger text-sm">{{ errors.first('enderecoTelefone') }}</span>
                            </div>
                        </div>
                    </div>
                    <vs-divider> Endereço </vs-divider>
                    <div class="vx-row" ref="enderecoCobranca">
                        <div class="vx-col sm:w-1/4 w-full mb-2"  v-on:keyup.enter="proximoCampo('endereco'), consultaCep(clienteEdit.endereco.cep)">
                            <div class="vs-component vs-con-input-label vs-input w-full vs-input-primary">
                                <label for="cepEndereco" class="vs-input--label">CEP*</label>
                                <div class="vs-con-input">
                                    <the-mask
                                        @input="cnpjnulo(cpfCnpj)"
                                        v-validate="'required'"
                                        :disabled="this.clienteEdit.clienteErp"
                                        id="cepEndereco" 
                                        name="cepEndereco" 
                                        v-model="clienteEdit.endereco.cep" 
                                        class="vs-inputx vs-input--input normal hasValue" 
                                        :mask="['#####-###']" 
                                        :masked="true">
                                    </the-mask>
                                </div>
                                <span class="text-danger text-sm">{{ errors.first('cepEndereco') }}</span>
                            </div>
                        </div>
                        <div class="vx-col sm:w-3/4 w-full mb-2" v-on:keyup.enter="proximoCampo('numeroEndereco')">
                            <vs-input @input="cnpjnulo(cpfCnpj,'endereco')" v-validate="'required'" :disabled="this.clienteEdit.clienteErp" label="Endereço*" id="endereco" name="endereco" v-model="clienteEdit.endereco.endereco" class="w-full"/>
                            <span class="text-danger text-sm">{{ errors.first('endereco') }}</span>
                        </div>
                    </div>
                    <div class="vx-row">
                        <div class="vx-col sm:w-1/6 w-full mb-2" v-on:keyup.enter="proximoCampo('complemento')">
                            <vs-input @input="cnpjnulo(cpfCnpj,'endereco')" v-validate="'required|numeric'" :disabled="this.clienteEdit.clienteErp" label="Numero*" id="numeroEndereco" name="numeroEndereco" v-model="clienteEdit.endereco.numero" class="w-full"/>
                            <span class="text-danger text-sm">{{ errors.first('numeroEndereco') }}</span>
                        </div>
                        <div class="vx-col sm:w-1/2 w-full mb-2" v-on:keyup.enter="proximoCampo('bairro')">
                            <vs-input @input="cnpjnulo(cpfCnpj,'endereco')" v-validate="'regex:.'" :disabled="this.clienteEdit.clienteErp" label="Complemento" id="complemento" name="complemento" v-model="clienteEdit.endereco.complemento" class="w-full"/>
                            <span class="text-danger text-sm">{{ errors.first('complemento') }}</span>
                        </div>
                        <div class="vx-col sm:w-1/3 w-full mb-2" v-on:keyup.enter="proximoCampo('cidade')">
                            <vs-input @input="cnpjnulo(cpfCnpj,'endereco')" v-validate="'required|alpha_spaces'" :disabled="this.clienteEdit.clienteErp" label="Bairro*" id="bairro" name="bairro" v-model="clienteEdit.endereco.bairro" class="w-full" />
                            <span class="text-danger text-sm">{{ errors.first('bairro') }}</span>
                        </div>
                    </div>
                    <div class="vx-row">
                        <div class="vx-col sm:w-5/6 w-full mb-2" v-on:keyup.enter="proximoCampo('estado')">
                            <label for="" class="vs-input--label">Cidade*</label>
                            <v-select
                                id="cidade"
                                name="cidade" 
                                :disabled="(this.clienteEdit.clienteErp) ? true : false"
                                :clearable=false
                                :options="getCitySelect"
                                v-model="clienteEdit.endereco.cidade" 
                                v-validate="'required'"
                                @input="cnpjnulo(cpfCnpj,'endereco'),consultaUf(clienteEdit.endereco.cidade.value)"
                            ></v-select>
                            <span class="text-danger text-sm">{{ errors.first('cidade') }}</span>
                        </div>
                        <div class="vx-col sm:w-1/6 w-full mb-2">
                            <vs-input @input="cnpjnulo(cpfCnpj,'endereco',clienteEdit.endereco.estado)" v-validate="'required|alpha_spaces'" :disabled="this.clienteEdit.clienteErp" label="Estado*" id="estado" name="estado" v-model="clienteEdit.endereco.estado" class="w-full"/>
                            <span class="text-danger text-sm">{{ errors.first('estado') }}</span>
                        </div>
                    </div>
                    <h5 v-if="!$route.params.clienteId" class="mt-5">Referências Comerciais</h5>
                    <div v-if="!$route.params.clienteId" class="vx-row flex justify-between" style="margin-left:20px;margin-right:20px;padding-top:20px;padding-bottom:20px">
                        <vs-col vs-lg="5" vs-xs="12">
                            <div class="vx-row" style="justify-content: flex-start;" v-for="(referenciaComercial, index) in listReferenciasComerciais" :key="`referenciaComercial-${index}`">
                                <vs-checkbox v-model="referenciaComercial.refSelecionada"></vs-checkbox>
                                <label>{{referenciaComercial.nome}}</label>
                            </div>
                        </vs-col>
                    </div>
                    <div class="vx-row">
                        <div class="vx-col w-full mb-2">
                            <label for="" class="vs-input--label">Referências Comerciais</label>
                            <vs-textarea @input="cnpjnulo(cpfCnpj,'referenciaComercial')" id="referenciaComercial" name="referenciaComercial" :disabled="this.clienteEdit.clienteErp" v-model="clienteEdit.referenciaComercial"/>
                        </div>
                    </div>
                    <div class="vx-row">
                        <div class="vx-col w-full mb-2">
                            <label for="" class="vs-input--label">Observações</label>
                            <vs-textarea @input="cnpjnulo(cpfCnpj,'observacao')" :disabled="this.clienteEdit.clienteErp" v-model="clienteEdit.observacao"/>
                        </div>
                    </div>
                    <div class="vx-row" v-if="!clienteEdit.clienteErp">
                        <div class="vx-col w-full mb-2">
                            <div class="con-upload">
                                <div class="con-img-upload" ref="customer-images">
                                    <div class="img-upload" v-for="(imagenCliente, index) in getFilesFilter" :key="`imagem-cliente-${index}`">
                                        <button class="btn-x-file" @click="removeImageCliente(index)">
                                            <i translate="translate" class="material-icons notranslate">clear</i>
                                        </button>
                                        <img :src="imagenCliente.base64" style="max-width: none; max-height: 100%;" />
                                    </div>
                                    <div class="con-input-upload" v-if="clienteEdit.imagens">
                                        <input type="file" multiple="multiple" accept="image/*" @change="onFileChanged" :disabled="clienteEdit.imagens.length >= 5"/>
                                        <span class="text-input">Selecione as Imagens</span>
                                        <button type="button" title="Upload" class="btn-upload-all vs-upload--button-upload" :disabled="clienteEdit.imagens.length >= 5">
                                            <i translate="translate" class="material-icons notranslate">cloud_upload</i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="vx-row">
                        <div class="vx-col my-5-top w-full">
                            <vs-button class="btn-confirm" color="success" type="filled" icon-pack="feather" v-if="!clienteEdit.clienteErp" icon="icon-save" @click="salvarCliente">Adicionar</vs-button>
                            <vs-button class="btn-cancel" color="danger" type="filled" icon-pack="feather" icon="icon-x" @click="cancelarCliente">Voltar</vs-button>
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
                                <vs-input v-validate="'required|alpha_spaces'" label="Nome Contato*" id="nomeContato" name="nomeContato" v-model="contatoEdit.nome" class="w-full" v-on:keyup.enter="proximoCampo('cargo')"/>
                                <span class="text-danger text-sm">{{ errors.first('nomeContato') }}</span>
                            </div>
                            <div class="vx-col sm:w-1/2 w-full mb-2">
                                <vs-input v-validate="'required|alpha_spaces'" label="Cargo*" id="cargo" name="cargo" v-model="contatoEdit.cargo" class="w-full" v-on:keyup.enter="proximoCampo('telefoneContato')"/>
                                <span class="text-danger text-sm">{{ errors.first('funcao') }}</span>
                            </div>
                        </div>
                        <div class="vx-row">
                            <div class="vx-col sm:w-1/2 w-full mb-2">
                                <div class="vs-component vs-con-input-label vs-input w-full vs-input-primary" v-on:keyup.enter="proximoCampo('celularContato')">
                                    <label for="" class="vs-input--label">Telefone</label>
                                    <div class="vs-con-input">
                                        <the-mask v-validate="'required'" type="tel" id="telefoneContato" name="telefoneContato" v-model="contatoEdit.telefone" class="vs-inputx vs-input--input normal hasValue" :mask="['(##) ####-####', '(##) #####-####']" :masked="true"/>
                                    </div>
                                    <span class="text-danger text-sm">{{ errors.first('telefoneContato') }}</span>
                                </div>
                            </div>
                            <div class="vx-col sm:w-1/2 w-full mb-2">
                                <div class="vs-component vs-con-input-label vs-input w-full vs-input-primary" v-on:keyup.enter="proximoCampo('emailContato')">
                                    <label for="" class="vs-input--label">Celular*</label>
                                    <div class="vs-con-input">
                                        <the-mask v-validate="'required'" type="tel" id="celularContato" name="celularContato" v-model="contatoEdit.celular" class="vs-inputx vs-input--input normal hasValue" :mask="['(##) ####-####', '(##) #####-####']" :masked="true"/>
                                    </div>
                                    <span class="text-danger text-sm">{{ errors.first('celularContato') }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="vx-row">
                            <div class="vx-col sm:w-1/2 w-full mb-2">
                                <vs-input v-validate="'required|email'" label="E-mail" id="emailContato" name="emailContato" v-model="contatoEdit.email" class="w-full" type="email" />
                                <span class="text-danger text-sm">{{ errors.first('emailContato') }}</span>
                            </div>
                        </div>
                         <div class="vx-row">
                            <div class="vx-col my-5-top w-full">
                                <vs-button color="success" class="mr-3 mb-2 pull-right" @click="salvarContato">Salvar</vs-button>
                                <vs-button color="danger" type="border" class="mr-2 mb-2 pull-right" @click="cancelarContato">Voltar</vs-button>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="cliente-contato-list" v-else>
                    <vs-table max-items="5" :data="clienteEdit.contatos">
                        <template slot="header">
                            <div class="mb-base-button">
                                <vs-button type="filled" icon-pack="feather" icon="icon-plus" @click="novoContato()">Novo</vs-button>
                            </div>
                        </template>
                        <template slot="thead">
                            <vs-th sort-key="nome" style="width:25%" >Nome</vs-th>
                            <vs-th sort-key="cargo" style="width:10%">Cargo</vs-th>
                            <vs-th sort-key="telefone" style="width:20%">Telefone</vs-th>
                            <vs-th sort-key="celular" style="width:20%">celular</vs-th>
                            <vs-th sort-key="email" style="width:25%">E-mail</vs-th>
                            <vs-th>Ações</vs-th>
                        </template>
                        <template slot-scope="{data}">
                            <vs-tr :state="data[indextr].ativo === false ? 'danger' :null" :key="indextr" v-for="(tr, indextr) in data">
                                <vs-td :data="data[indextr].nome">
                                    {{ data[indextr].nome }}
                                </vs-td>
                                <vs-td :data="data[indextr].funcao">
                                    {{ data[indextr].cargo }}
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
                                        <div class="p-1 mr-1">
                                            <vs-button type="filled" size="small" name="Editar" icon-pack="feather" color="warning" icon="icon-edit-2" @click="editarContato(data[indextr], indextr)" />
                                        </div>
                                        <div class="p-1 mr-1">
                                            <vs-button type="filled" size="small" icon-pack="feather" color="danger" icon="icon-x" v-if="!data[indextr].contatoErp" @click="deletarMessage(data[indextr], indextr, 'contato')"/>
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
            <vx-card title="Endereços de Entrega">
                <div id="cliente-endereco-edit" v-if="isEditEndereco">
                    <div class="my-1">
                        <div class="vx-row">
                            <div class="vx-col sm:w-1/4 w-full mb-2">
                                <div class="vs-component vs-con-input-label vs-input w-full vs-input-primary" v-on:keyup.enter="proximoCampo('cadEndereco'), consultaCepEnd(enderecoEdit.cep)">
                                    <label for="cadCepEndereco" class="vs-input--label">CEP*</label>
                                    <div class="vs-con-input">
                                        <the-mask v-validate="'required'" :disabled="enderecoEdit.enderecoErp" id="cadCepEndereco" name="cadCepEndereco" v-model="enderecoEdit.cep" class="vs-inputx vs-input--input normal hasValue" :mask="['#####-###']" :masked="true"/>
                                    </div>
                                    <span class="text-danger text-sm">{{ errors.first('cadCepEndereco') }}</span>
                                </div>
                            </div>
                            <div class="vx-col sm:w-3/4 w-full mb-2">
                                <vs-input v-validate="'required'" :disabled="enderecoEdit.enderecoErp" label="Endereço*" id="cadEndereco" name="cadEndereco" v-model="enderecoEdit.endereco" class="w-full" v-on:keyup.enter="proximoCampo('cadNumeroEndereco')"/>
                                <span class="text-danger text-sm">{{ errors.first('cadEndereco') }}</span>
                            </div>
                        </div>
                        <div class="vx-row">
                            <div class="vx-col sm:w-1/6 w-full mb-2">
                                <vs-input v-validate="'required|numeric'" :disabled="enderecoEdit.enderecoErp" label="Numero*" id="cadNumeroEndereco" name="cadNumeroEndereco" v-model="enderecoEdit.numero" class="w-full" v-on:keyup.enter="proximoCampo('cadComplemento')"/>
                                <span class="text-danger text-sm">{{ errors.first('cadNumeroEndereco') }}</span>
                            </div>
                            <div class="vx-col sm:w-1/2 w-full mb-2">
                                <vs-input v-validate="'regex:.'" :disabled="enderecoEdit.enderecoErp" label="Complemento" id="cadComplemento" name="cadComplemento" v-model="enderecoEdit.complemento" class="w-full" v-on:keyup.enter="proximoCampo('cadBairro')"/>
                                <span class="text-danger text-sm">{{ errors.first('cadComplemento') }}</span>
                            </div>
                            <div class="vx-col sm:w-1/3 w-full mb-2">
                                <vs-input :disabled="enderecoEdit.enderecoErp" v-validate="'required|alpha_spaces'" label="Bairro*" id="cadBairro" name="cadBairro" v-model="enderecoEdit.bairro" class="w-full" v-on:keyup.enter="proximoCampo('cadEstado')"/>
                                <span class="text-danger text-sm">{{ errors.first('cadBairro') }}</span>
                            </div>
                        </div>
                        <div class="vx-row">
                            <div class="vx-col sm:w-1/2 w-full mb-2" v-on:keyup.enter="proximoCampo('cadEstado')">
                                <label for="" class="vs-input--label">Cidade*</label>
                                <v-select
                                    id="cidade"
                                    name="cidade" 
                                    :disabled="enderecoEdit.enderecoErp"
                                    :clearable=false
                                    :options="getCitySelect"
                                    :taggable=true
                                    :push-tags=true
                                    v-model="cidadeEnderecoCliente"
                                    v-validate="'required'">
                                </v-select>
                                <span class="text-danger text-sm">{{ errors.first('cadCidade') }}</span>
                            </div>
                            <div class="vx-col sm:w-1/6 w-full mb-2">
                                <vs-input :disabled="enderecoEdit.enderecoErp" v-validate="'required|alpha_spaces'" label="Estado*" id="cadEstado" name="cadEstado" v-model="enderecoEdit.estado" class="w-full" v-on:keyup.enter="proximoCampo('cadEnderecoTelefone')"/>
                                <span class="text-danger text-sm">{{ errors.first('cadEstado') }}</span>
                            </div>
                            <div class="vx-col sm:w-1/3 w-full mb-2">
                                <div class="vs-component vs-con-input-label vs-input w-full vs-input-primary">
                                    <label for="cadEnderecoTelefone" class="vs-input--label">Telefone*</label>
                                    <div class="vs-con-input">
                                        <the-mask :disabled="enderecoEdit.enderecoErp" v-validate="'required'" type="tel" id="cadEnderecoTelefone" name="cadEnderecoTelefone" v-model="enderecoEdit.telefone" class="vs-inputx vs-input--input normal hasValue" :mask="['(##) ####-####', '(##) #####-####']" :masked="true"/>
                                    </div>
                                    <span class="text-danger text-sm">{{ errors.first('cadEnderecoTelefone') }}</span>
                                </div>
                            </div>
                            <div class="mt-5">
                                <vs-checkbox id="endEntrega" name="endEntrega" v-model="enderecoEdit.principal" class="mt-5">Endereço de Entrega</vs-checkbox>
                            </div>
                        </div>
                        <div class="vx-row">
                            <div class="vx-col my-5-top w-full">
                                <vs-button color="success" class="mr-3 mb-2 pull-right" @click="salvarEndereco">Salvar</vs-button>
                                <vs-button color="danger" type="border" class="mr-2 mb-2 pull-right" @click="cancelarEndereco">Voltar</vs-button>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="cliente-endereco-list" v-else>
                    <vs-table max-items="5" :data="clienteEdit.enderecos">
                        <template slot="header">
                            <div class="mb-base-button">
                                <vs-button type="filled" icon-pack="feather" icon="icon-plus" @click="novoEndereco()">Novo</vs-button>
                            </div>
                        </template>
                        <template slot="thead">
                            <vs-th sort-key="endereco">Endereço</vs-th>
                            <vs-th sort-key="cep">CEP</vs-th>
                            <vs-th sort-key="cidade">Cidade</vs-th>
                            <vs-th sort-key="estado">UF</vs-th>
                            <vs-th sort-key="telefone">Telefone</vs-th>
                            <vs-th>Ações</vs-th>
                        </template>
                        <template slot-scope="{data}">
                            <vs-tr :state="data[indextr].ativo === false ? 'danger' :null" :key="indextr" v-for="(tr, indextr) in data">
                                <vs-td :data="data[indextr].endereco">
                                    {{ data[indextr].endereco }}
                                </vs-td>
                                <vs-td :data="data[indextr].cep">
                                    {{ data[indextr].cep }}
                                </vs-td>
                                <vs-td :data="data[indextr].cidade">
                                    {{ data[indextr].cidade}}
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
                                            <vs-button type="filled" size="small" name="Editar" icon-pack="feather" color="warning" icon="icon-edit-2" @click="editarEndereco(data[indextr], indextr)" />
                                        </div>
                                        <div class="p-1">
                                            <vs-button type="filled" size="small" icon-pack="feather" color="danger" icon="icon-x" v-if="!data[indextr].enderecoErp" @click="deletarMessage(data[indextr], indextr, 'endereco')"/>
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
import validatePtBR from '../../rapidsoft/validate/validate_ptBR';
import Datepicker from 'vuejs-datepicker';
import * as lang from "vuejs-datepicker/src/locale";
import vSelect from 'vue-select';
import _ from 'lodash';
import ClienteDB from '../../rapidsoft/db/clienteDB';
import CidadeDB from '../../rapidsoft/db/cidadeDB';
import CidadeService from '../../rapidsoft/service/cidadeService';
import GrupoClienteDB from '../../rapidsoft/db/grupoClienteDB';
import ErrorDB from '../../rapidsoft/db/errorDB';
import SegmentoDB from '../../rapidsoft/db/segmentoDB';
import ReferenciaComercialDB from "../../rapidsoft/db/referenciaComercialDB";
import moment from 'moment';

Validator.localize('pt', validatePtBR);

export default {
    data() {
        return {    
            cpfCnpj: null, 
            tipoPessoa: 1,
            grupoCliente: null,
            segmentosCliente: [],
            cepCobranca: null,
            clienteEdit: {
                tipoPessoa: 1,
                inscricaoEstadual: "ISENTO",
                clienteErp: false,
                endereco: {},
                contatos: [],
                enderecos: [],
                imagens: [],
                segmentos: []
            },
            carrinhoCliente: false,
            listReferenciasComerciais: [],     
            contatoEdit: {},
            enderecoEdit: {},
            isEditContato: false,
            isEditEndereco: false,
            langSettings: lang.ptBR,
            segmentos: [],
            grupoClientes: [],
            listCidades: [],
            cidadeCliente:null,
            indexEditEndereco: null,
            indexEditContato: null,
            cidadeEnderecoCliente: null,
            idExistente: false,
            referenciasSelecionadas: []
        }
    },
    components: {
        Datepicker,
        'v-select': vSelect,
    },
    watch: {
        cpfCnpj(val) {
            this.clienteEdit.cpfCnpj = val;
            if(this.clienteEdit.cpfCnpj) {
                if(this.clienteEdit.cpfCnpj.length === 14) {
                    this.tipoPessoa = 2;
                } else {
                    this.tipoPessoa = 1;
                }
            } else {
                this.tipoPessoa = 1;
            }
        },
        tipoPessoa(val) {
            this.clienteEdit.tipoPessoa = val;
        },
        grupoCliente(val) {
            this.clienteEdit.grupoCliente = val.value;
        },
        cidadeEnderecoCliente(val) {
            this.enderecoEdit.cidade = val.label;
        },
        cepCobranca(val) {
            this.clienteEdit.endereco.cep = val;
        },
        segmentosCliente(val) {
            this.clienteEdit.segmentos = val.map((segmento) => {
                return _.toString(segmento.value);
            });
        },
    },
    computed:{
        getFilesFilter() {
            return this.clienteEdit.imagens;
        },
        isJuridico() {
            if(this.tipoPessoa == 1) {
                return true;
            } else {
                return false;
            }
        },
        getCitySelect(){
            return this.listCidades.map((cidade) => {
                return {value:cidade.idCidade, label:cidade.nome};
            })
        },
        getGrupoClientesSelect() {
            return this.grupoClientes.map((grupo) => {
                return {value: grupo.id, label: grupo.nome, padrao: grupo.padrao};
            })
        },
        getSegmentosCheckBox() {
            return this.segmentos.map((segmento) => {
                return {value: segmento.id, label: segmento.nome};
            });
        }
    },
    methods: {
        cnpjnulo(cpfCnpj, key = null, uf = null) {
            const cliente = {cep: null,telefone: null, estado:null,bairro:null,complemento:null,numero:null,endereco:null};
            if (cpfCnpj && cpfCnpj.length == 0) {
                this.clienteEdit[key] = _.isObject(this.clienteEdit[key]) ? cliente : null;
                this.proximoCampo('cpfCnpj');
            } else {
                if (uf && uf.length > 1) {
                    this.getGroupClient(uf);
                }
            }
        },
        verificaCnpjClienteNovo(id) {
            if (id && !this.$route.params.clienteId) {
                id = id.replace(/[^a-z0-9]/gi, "");
                
                ClienteDB._getById(id).then((cliente) => {
                    this.idExistente = cliente.existe;
                });
            } else {
                this.proximoCampo('cpfCnpj');
            }
        },
        deletarMessage(data,index,itemExcluir) {
            this.$vs.dialog({
                type:'confirm',
                color:'danger',
                title:'Deseja excluir?',
                text:`Você está prestes a excluir um ${itemExcluir}. Deseja continuar?`,
                accept:itemExcluir === 'contato' ? this.deletarContato : this.deletarEndereco,
                acceptText: 'Continuar',
                cancelText: 'Cancelar',
                parameters: index
            })
        },
        getGroupClient(uf){
            this.grupoCliente = {};
            this.grupoClientes.map((item) => {
                item.estados.map((estado) => {
                    if (estado === uf) {
                        this.grupoCliente = {value: item.id, label: item.nome, padrao: item.padrao}; 
                    }
                });
                if (!this.grupoCliente.label) {
                    this.grupoCliente = {value: 33, label: "PADRÃO", padrao: true}; 
                }
            });
        },
        notificacao(titulo,mensagem,cor) {
            this.$vs.notify({
                title: titulo,
                text: mensagem,
                color: cor,
                iconPack: 'feather',
                icon: 'icon-alert-circle',
                position:'top-right'
            });
        },
        scrollMeTo(refName) {
            var element = this.$refs[refName];
            var top = element.offsetTop;
            window.scrollTo(0, top);
        },
        proximoCampo(refName) {                  
            document.getElementById(refName).focus();
        },
        toBase64(file, callback) {
            const reader = new FileReader();
            reader.readAsDataURL(file); 
            reader.onloadend = function() {
                callback(reader.result);
            }
        },
        onFileChanged(event) {
            let index = 0;
            Array.from(event.target.files).forEach(file => {
                this.$vs.loading();
                let imagem = {};
                imagem.index = index;
                imagem.name = file.name
                imagem.size = file.size
                imagem.type = file.type
                imagem.lastModified = file.lastModified;
                this.toBase64(file, (imageNase64) => {
                    imagem.base64 = imageNase64;
                    this.clienteEdit.imagens.push(imagem);
                    this.$vs.loading.close();
                })
                index++;
            });
        },
        removeImageCliente(index) {
            for( var i = 0; i < this.clienteEdit.imagens.length; i++){ 
                if (this.clienteEdit.imagens[i] === this.clienteEdit.imagens[index]) {
                    this.clienteEdit.imagens.splice(i, 1); 
                }
            }
        },
        novoContato() {
            this.isEditContato = true;
            
            this.contatoEdit = {};
            
            setTimeout(() => {
                this.proximoCampo('nomeContato');
            }, 100);
        },
        editarContato(contato, index) {
            this.isEditContato = true;
            
            this.contatoEdit = contato;
            this.indexEditContato = index;
            
            setTimeout(() => {
                this.proximoCampo('nomeContato');
            }, 100);
        },
        deletarContato(index) {
            this.clienteEdit.contatos.splice(index, 1);
            
            if (this.$route.params.clienteId) {
                const cliente = this.prepareSalvarCliente();
                ClienteDB.salvar(cliente).then((result) => {
                    this.prepareClienteEdit(result);
                    this.notificacao('Removido','O contato foi removido','success');
                });
            }
        },
        salvarContato() {          
            ClienteDB.validarContato(this.contatoEdit).then(() => {
                if (this.indexEditContato !== null) {
                    this.clienteEdit.contatos.splice(this.indexEditContato, 1);
                }
                this.clienteEdit.contatos.push(_.clone(this.contatoEdit));
                
                if (this.$route.params.clienteId) {
                    const cliente = this.prepareSalvarCliente();
                    ClienteDB.salvar(cliente).then((result) => {
                        this.prepareClienteEdit(result);
                        this.notificacao('Salvo','O contato foi salvo','success');
                    })
                }
                
                this.indexEditContato = null;
                this.isEditContato = false;

            }).catch((erro) => {
                this.$validator.validate();       
                if (erro.campo) {
                    this.proximoCampo(erro.campo);
                }
                this.$vs.notify({
                    title: 'Erro!',
                    text: erro.mensagem,
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle'
                });
            });
        },
        cancelarContato() {
            this.indexEditContato = null;
            this.isEditContato = false;
        },
        novoEndereco() {
            this.isEditEndereco = true;
            
            this.enderecoEdit = {};
            
            setTimeout(() => {
                this.proximoCampo('cadCepEndereco');
            }, 100);
        },
        editarEndereco(endereco, index) {
            this.isEditEndereco = true;
            
            this.enderecoEdit = endereco;
            this.indexEditEndereco = index;
            this.cidadeEnderecoCliente = {label: this.enderecoEdit.cidade, value: this.enderecoEdit.idCidade};

            setTimeout(() => {
                this.proximoCampo('cadCepEndereco');
            }, 100);
        },
        deletarEndereco(index) {
            this.clienteEdit.enderecos.splice(index, 1);
            
            this.atualizarEnderecoPrincipal(false);
            
            if (this.$route.params.clienteId) {
                const cliente = this.prepareSalvarCliente();
                
                ClienteDB.salvar(cliente).then((result) => {
                    this.prepareClienteEdit(result);
                    this.notificacao('Removido','O endereço foi removido','success');
                });
            }
        },
        salvarEndereco() {
            if (this.enderecoEdit.principal) this.desmarcarOutrosEnderecoPrincipal();
            
            if (this.indexEditEndereco !== null) {
                this.clienteEdit.enderecos.splice(this.indexEditEndereco, 1);
            }
            this.clienteEdit.enderecos.push(_.clone(this.enderecoEdit));
            
            if (this.$route.params.clienteId) {
                const cliente = this.prepareSalvarCliente();
                ClienteDB.salvar(cliente).then((result) => {
                    this.prepareClienteEdit(result);
                    this.notificacao('Salvo','O endereço foi salvo','success');
                });
            }
            
            this.indexEditEndereco = null;
            this.isEditEndereco = false;
        },
        desmarcarOutrosEnderecoPrincipal() {
            this.clienteEdit.enderecos.map((endereco,index) => {
                if (index !== this.indexEditEndereco) {
                    endereco.principal = false;
                    return endereco;
                }
            });
        },
        cancelarEndereco() {
            this.indexEditEndereco = null;
            this.isEditEndereco = false;
        },
        erroPermissaoCidade() {
            this.$vs.notify({
                title: 'Erro!',
                text: 'Cidade não liberada para cadastrar clientes',
                color: 'danger',
                iconPack: 'feather',
                icon: 'icon-alert-circle',
                position:'top-right'
            })
        },
        consultaCepEnd(cep) {
            const endereco = {};
            endereco.cep = cep;
            if (navigator.onLine && cep.length === 9) {
                this.$vs.loading();
                CidadeService.buscaEndereco(this.enderecoEdit.cep).then((enderecoCep) =>{
                    if (enderecoCep) {
                        CidadeDB.buscaCidade(enderecoCep.id).then((cidade) => {
                            endereco.cep = cep;
                            endereco.endereco = enderecoCep.e;
                            endereco.bairro = enderecoCep.b;
                            this.cidadeEnderecoCliente = {label: cidade.result.nome, value: cidade.result.idCidade};
                            endereco.cidade = cidade.result.nome;
                            endereco.idCidade = cidade.result.idCidade;
                            endereco.estado = cidade.result.uf;
                            this.proximoCampo('cadNumeroEndereco');
                            
                            this.$set(this.enderecoEdit, 'endereco', endereco.endereco)
                            this.$set(this.enderecoEdit, 'bairro', endereco.bairro)
                            this.$set(this.enderecoEdit, 'cidade', endereco.cidade)
                            this.$set(this.enderecoEdit, 'estado', endereco.estado)
                        })
                    } else {
                        this.$vs.loading.close();
                        this.notificacao('Atenção!','Nenhum endereço foi localizado para esse cep!','warning');
                        this.proximoCampo('cadEndereco');
                    }
                    this.$vs.loading.close();
                });
            } else {
                this.$set(this.enderecoEdit, 'endereco', endereco.endereco);
            }
        },
        consultaCep(cep) {
            const endereco = {};
            endereco.cep = cep;
            endereco.endereco = null;
            endereco.bairro = null;
            endereco.cidade = null;
            endereco.estado = null;
            endereco.telefone = this.clienteEdit.endereco.telefone;
            if (navigator.onLine && cep && cep.length === 9) {
                this.$vs.loading();
                CidadeService.buscaEndereco(this.clienteEdit.endereco.cep).then((enderecoCep) =>{
                    if (enderecoCep) {
                        CidadeDB.buscaCidade(enderecoCep.id).then((cidade) => {
                            if (cidade.existe && cidade.result.rel === 1) {
                                endereco.cep = cep;
                                endereco.endereco = enderecoCep.e;
                                endereco.bairro = enderecoCep.b;
                                endereco.cidade = {label: cidade.result.nome, value: cidade.result.idCidade };
                                endereco.estado = cidade.result.uf;
                                this.getGroupClient(endereco.estado);
                                this.proximoCampo('numeroEndereco');
                            } else {
                                this.erroPermissaoCidade()
                                this.proximoCampo('cepEndereco');
                            }

                            this.$set(this.clienteEdit, 'endereco', endereco);
                        })
                    } else {
                        this.$vs.loading.close();
                        this.notificacao('Atenção!','Nenhum endereço foi localizado para esse cep!','warning');
                        this.proximoCampo('cepEndereco');
                    }
                    this.$vs.loading.close();
                })
            } else {
                this.$set(this.clienteEdit, 'endereco', endereco);
            }
        },
        consultaUf(idCidade) {
            if (idCidade) {
                CidadeDB.buscaCidade(idCidade).then((cidade) => {
                    if (cidade.existe && cidade.result.rel === 1) {
                        this.clienteEdit.endereco.estado = cidade.result.uf;
                        this.getGroupClient(this.clienteEdit.endereco.estado);
                    }
                    this.$forceUpdate();
                })
            }
        },
        getReferencias() {
            const ref = this.listReferenciasComerciais.filter((refComercial) => refComercial.refSelecionada == true);
            const listReferencias = ref.map((referencia) => {
                return referencia['nome'];
            });
            return _.join(listReferencias,', ');
            
        },
        salvarCliente() {
            this.$vs.loading();
            
            const cliente = this.prepareSalvarCliente();
            
            setTimeout(() => {
                ClienteDB.salvar(cliente).then((clienteSalvo) => {
                    this.prepareClienteEdit(clienteSalvo);

                    this.$vs.notify({
                        title: 'Sucesso',
                        text: 'Cliente Salvo!',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    });
                    this.$vs.loading.close();
                    if (this.carrinhoCliente) {
                        this.$router.push({ name: 'carrinhoPedido',
                            params: {pedidoEmbarques: this.$route.params.pedidoEmbarques, clienteSalvo}
                        });
                    } else {
                        this.$router.push('/cliente/consulta');
                    }
                }).catch((erro) => {
                    this.$vs.loading.close();
                    this.$validator.validate();
                    if (erro.campo) {
                        this.proximoCampo(erro.campo);
                    }
                    this.$vs.notify({
                        title: 'Erro!',
                        text: erro.mensagem + '-' + erro.campo,
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                });
            }, 300);
            this.$vs.loading.close();
        },
        prepareSalvarCliente() {
            const cliente = _.cloneDeep(this.clienteEdit);
            cliente.id = cliente.cpfCnpj.replace(/[^a-z0-9]/gi, "");
            cliente.endereco.cep = cliente.endereco.cep.replace(/[^a-z0-9]/gi, "");
            cliente.nome = (cliente.nome == null) ? cliente.nomeFantasia : cliente.nome;
            cliente.dataFundacao = (cliente.dataFundacao) ? moment(cliente.dataFundacao, ["DD/MM/YYYY"]).toDate().getTime() : undefined;
            cliente.dataAniversario = (cliente.dataAniversario) ? moment(cliente.dataAniversario, ["DD/MM/YYYY"]).toDate().getTime() : undefined;
            cliente.endereco.cidade = cliente.endereco.cidade ? cliente.endereco.cidade.label : null;
            
            if (_.findIndex(this.segmentosCliente, {'value':3333}) >= 0) {
                cliente.segmentos = ['3','5'];
            }
            cliente.referenciaComercial = cliente.referenciaComercial 
                ? cliente.referenciaComercial  + ' - ' + this.getReferencias() 
                    : this.getReferencias();
            
            return cliente;
        },
        cancelarCliente() {
            if (this.$route.params.carrinhoCliente) {
                this.$router.push({ name: 'carrinhoPedido',
                    params: {pedidoEmbarques: this.$route.params.pedidoEmbarques}
                });
            } else {
                this.$router.push('/cliente/consulta');
            }
        },

        findById(idCliente) {
            return new Promise((resolve) => {
                ClienteDB.findById(idCliente).then((cliente) => {
                    this.prepareClienteEdit(cliente);

                    resolve();
                });
            });
        },
        prepareClienteEdit(cliente) {
            cliente.grupoCliente = cliente.grupoCliente ? cliente.grupoCliente : 33;
            this.grupoCliente = this.getGrupoClientesSelect.find((grupo) => grupo.value === cliente.grupoCliente );
            this.grupoCliente = this.grupoCliente ? this.grupoCliente : {value:33,label:'PADRÃO',padrao:true};
            this.cpfCnpj = cliente.cpfCnpj;
            if (cliente.segmentos && cliente.segmentos.length > 0) {
                this.segmentosCliente = cliente.segmentos.map((segmentoCliente) => {
                    return this.getSegmentosCheckBox.find((segmento) => segmentoCliente.toString() == segmento.value.toString());
                });
            }
            cliente.dataFundacao = (cliente.dataFundacao) ? moment(new Date(Number(cliente.dataFundacao))).format('DD/MM/YYYY') : undefined;
            cliente.dataAniversario = (cliente.dataAniversario) ? moment(new Date(Number(cliente.dataAniversario))).format('DD/MM/YYYY') : undefined;
            cliente.endereco.cidade = {value:cliente.endereco.idCidade, label:cliente.endereco.cidade};
            this.clienteEdit = cliente;
        },
        listaCidades(callback) {
            CidadeDB.getCidadesRelacionadas().then((cidades) => {
                this.listCidades = cidades;
                callback();
            });
            
        },
        listaReferenciasComerciais(callback) {
            ReferenciaComercialDB.getAll().then((referenciasComerciais) => {
                this.listReferenciasComerciais = referenciasComerciais;
                callback();
            });
        },
        buscaGrupos(callback) {
            GrupoClienteDB._getAll().then((grupos) => {
                this.grupoClientes = grupos;
                callback();
            });
        },
        buscaSegmentos(callback) {
            SegmentoDB._getAll().then((segmentos) => {
                this.segmentos = segmentos;
                this.segmentos.push({id: 3333,nome:'Fitnes + Moda Praia'})
                callback();
            })
        },
        carregaItensTela() {
            return new Promise((resolve) => {
                this.buscaGrupos(() => {
                    this.buscaSegmentos(() => {
                        this.listaCidades(() => {
                            this.listaReferenciasComerciais(() => {
                                if (this.$route.params.clienteId) {
                                    this.findById(this.$route.params.clienteId).then(() => {
                                        setTimeout(() => {
                                            this.proximoCampo('cpfCnpj');
                                        }, 200);
                                        resolve();
                                    });
                                } else {
                                    if (this.$route.params.carrinhoCliente) {
                                        this.carrinhoCliente = true;
                                    } else {
                                        this.carrinhoCliente = false;
                                    }
                                    setTimeout(() => {
                                        this.proximoCampo('cpfCnpj');
                                    }, 200);
                                    resolve();
                                }
                                document.getElementById('loading-bg').style.display = "none";
                            });
                        });
                    });
                });
            });
        },        
    },
    async mounted() {
        await this.carregaItensTela();
    },
    errorCaptured(err, vm, info) {
        ErrorDB._criarLog({err, vm, info});
        return true;
    },
}

</script>

<style>

.btn-confirm {
    position: fixed;
    top: 50%;
    right: -50px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    z-index: 1000;
    width: 10rem;
    transform: rotate(-90deg);
}

.btn-cancel {
    position: fixed;
    top: 50%;
    left: -50px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    z-index: 1000;
    width: 10rem;
    transform: rotate(90deg);
}

.mb-base-button {
    margin-bottom: 0.8rem !important;
}

.con-img-upload .img-upload {
    width: 185px;
    height: 185px;
}

.my-5-top {
    margin-top: 1.25rem !important;    
}

.vdp-datepicker input:blur {
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, .15);
}

.vx-card {
    width: 100%
}

.vs-input--input.normal {
    font-size: 0.75rem;
}

</style>
