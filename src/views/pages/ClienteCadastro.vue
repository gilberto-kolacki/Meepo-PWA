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
                            <div class="vs-component vs-con-input-label vs-input w-full vs-input-primary" v-on:keyup.enter="isJuridico ? proximoCampo('razaoSocial') : proximoCampo('nomeCliente')">
                                <label for="" class="vs-input--label">CPF/CNPJ*</label>
                                <div class="vs-con-input">
                                    <the-mask v-validate="'required|min:14'" id="cpfCnpj" name="cpfCnpj" v-model="cpfCnpj" class="vs-inputx vs-input--input normal hasValue" :mask="['###.###.###-##', '##.###.###/####-##']" :masked="true" />
                                </div>
                                <span class="text-danger text-sm">{{ errors.first('cpfCnpj') }}</span>
                            </div>
                        </div>
                        <div v-if="isJuridico" class="vx-col sm:w-3/4 w-full mb-2" v-on:keyup.enter="proximoCampo('fantasia')">
                            <vs-input v-validate="'required'" label="Razão Social*" id="razaoSocial" name="razaoSocial" v-model="clienteEdit.razaoSocial" class="w-full" />
                            <span class="text-danger text-sm">{{ errors.first('razaoSocial') }}</span>
                        </div>
                        <div v-else class="vx-col sm:w-3/4">
                            <div v-on:keyup.enter="proximoCampo('dataAniversario')">
                                <vs-input v-validate="'required'" label="Nome*" id="nomeCliente" name="nomeCliente" v-model="clienteEdit.nome" class="w-full" />
                                <span class="text-danger text-sm" v-if="errors.has('nomeCliente')">{{ errors.first('nomeCliente') }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="vx-row" v-if="isJuridico">
                        <div class="vx-col w-full mb-2" v-on:keyup.enter="proximoCampo('dataFundacao')">
                            <vs-input v-validate=" isJuridico ? 'required' : ''" label="Fantasia*" id="fantasia" name="fantasia" v-model="clienteEdit.nomeFantasia" class="w-full" />
                            <span class="text-danger text-sm">{{ errors.first('fantasia') }}</span>
                        </div>
                    </div>
                    <div class="vx-row">
                        <div class="vx-col sm:w-1/4 w-full mb-2" v-if="isJuridico" v-on:keyup.enter="proximoCampo('inscricaoEstadual')">
                            <label for="dataFundacao" class="vs-input--label">Data Fundação*</label>
                            <datepicker 
                                v-validate="'required'" 
                                placeholder="DD/MM/AAAA" 
                                v-model="clienteEdit.dataFundacao" 
                                format="dd/MM/yyyy" 
                                id="dataFundacao" 
                                name="dataFundacao" 
                                ref="dataFundacao" 
                                :language="langSettings" 
                                wrapper-class="w-full"
                                input-class="vs-inputx vs-input--input normal">
                            </datepicker>
                            <span class="text-danger text-sm">{{ errors.first('dataFundacao') }}</span>
                        </div>
                        <div v-else class="vx-col sm:w-1/4">
                            <div v-on:keyup.enter="proximoCampo('registroGeral')" >
                                <label for="dataAniversario" class="vs-input--label">Data Aniversário*</label>
                                <datepicker 
                                    v-validate="'required'" 
                                    placeholder="DD/MM/AAAA" 
                                    v-model="clienteEdit.dataAniversario" 
                                    format="dd/MM/yyyy" 
                                    id="dataAniversario"
                                    name="dataAniversario"
                                    ref="dataAniversario" 
                                    :language="langSettings" 
                                    wrapper-class="w-full" 
                                    input-class="vs-inputx vs-input--input normal">
                                </datepicker>
                                <span class="text-danger text-sm">{{ errors.first('dataAniversario') }}</span>
                            </div>
                        </div>
                        <div class="vx-col sm:w-1/4 w-full mb-2" v-if="isJuridico">
                            <div class="vs-component vs-con-input-label vs-input w-full vs-input-primary" v-on:keyup.enter="proximoCampo('emailNfe')">
                                <vs-input v-validate="'required'" label="Inscrição Estadual*" id="inscricaoEstadual" name="inscricaoEstadual" v-model="clienteEdit.inscricaoEstadual" class="w-full" />
                                <span class="text-danger text-sm">{{ errors.first('inscricaoEstadual') }}</span>
                            </div>
                        </div>
                        <div class="vx-col sm:w-1/4 w-full mb-2" v-else v-on:keyup.enter="proximoCampo('emailNfe')">
                            <div class="vs-component vs-con-input-label vs-input w-full vs-input-primary">
                                <label for="registroGeral" class="vs-input--label">RG*</label>
                                <div class="vs-con-input">
                                    <the-mask v-validate="'required'" id="registroGeral" name="registroGeral" v-model="clienteEdit.registroGeral" class="vs-inputx vs-input--input normal hasValue" :mask="['#.###.###-#', '##.###.###-#', '#.###.###']" :masked="true" />
                                </div>
                                <span class="text-danger text-sm">{{ errors.first('registroGeral') }}</span>
                            </div>
                        </div>
                        <div class="vx-col sm:w-1/2 w-full mb-2">
                            <label for="" class="vs-input--label">Segmentos*</label>
                            <v-select multiple v-validate="'required'" id="segmento" name="segmento" v-model="segmentosCliente" :options="getSegmentosCheckBox"></v-select>
                            <span class="text-danger text-sm">{{ errors.first('segmento') }}</span>
                        </div>
                    </div>
                    <div class="vx-row">
                        <div class="vx-col sm:w-1/2 w-full mb-2" v-on:keyup.enter="proximoCampo('enderecoTelefone')">
                            <vs-input v-validate="'required|email'" label="E-mail NFe*" id="emailNfe" name="emailNfe" v-model="clienteEdit.emailNfe" class="w-full" type="email" />
                            <span class="text-danger text-sm">{{ errors.first('emailNfe') }}</span>
                        </div>
                        <div class="vx-col sm:w-1/2 w-full mb-2" v-on:keyup.enter="proximoCampo('cepEndereco')">
                            <div class="vs-component vs-con-input-label vs-input w-full vs-input-primary">
                                <label for="" class="vs-input--label">Telefone*</label>
                                <div class="vs-con-input">
                                    <the-mask v-validate="'required'" type="tel" id="enderecoTelefone" name="enderecoTelefone" v-model="clienteEdit.endereco.telefone" class="vs-inputx vs-input--input normal hasValue" :mask="['(##) ####-####', '(##) #####-####']" :masked="true"/>
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
                                        v-validate="'required'" 
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
                            <vs-input v-validate="'required|alpha_spaces'" label="Endereço*" id="endereco" name="endereco" v-model="clienteEdit.endereco.endereco" class="w-full"/>
                            <span class="text-danger text-sm">{{ errors.first('endereco') }}</span>
                        </div>
                    </div>
                    <div class="vx-row">
                        <div class="vx-col sm:w-1/6 w-full mb-2" v-on:keyup.enter="proximoCampo('complemento')">
                            <vs-input v-validate="'required|numeric'" label="Numero*" id="numeroEndereco" name="numeroEndereco" v-model="clienteEdit.endereco.numero" class="w-full"/>
                            <span class="text-danger text-sm">{{ errors.first('numeroEndereco') }}</span>
                        </div>
                        <div class="vx-col sm:w-1/2 w-full mb-2" v-on:keyup.enter="proximoCampo('bairro')">
                            <vs-input v-validate="'regex:.'" label="Complemento" id="complemento" name="complemento" v-model="clienteEdit.endereco.complemento" class="w-full"/>
                            <span class="text-danger text-sm">{{ errors.first('complemento') }}</span>
                        </div>
                        <div class="vx-col sm:w-1/3 w-full mb-2" v-on:keyup.enter="proximoCampo('cidade')">
                            <vs-input v-validate="'required|alpha_spaces'" label="Bairro*" id="bairro" name="bairro" v-model="clienteEdit.endereco.bairro" class="w-full" />
                            <span class="text-danger text-sm">{{ errors.first('bairro') }}</span>
                        </div>
                    </div>
                    <div class="vx-row">
                        <div class="vx-col sm:w-1/2 w-full mb-2" v-on:keyup.enter="proximoCampo('estado')">
                            <vs-input v-validate="'required|alpha_spaces'" label="Cidade*" id="cidade" name="cidade" v-model="clienteEdit.endereco.cidade" class="w-full"/>
                            <span class="text-danger text-sm">{{ errors.first('cidade') }}</span>
                        </div>
                        <div class="vx-col sm:w-1/6 w-full mb-2" v-on:keyup.enter="proximoCampo('referenciaComercial')">
                            <vs-input v-validate="'required|alpha_spaces'" label="Estado*" id="estado" name="estado" v-model="clienteEdit.endereco.estado" @change="getGroupClient(clienteEdit.endereco.estado)" class="w-full"/>
                            <span class="text-danger text-sm">{{ errors.first('estado') }}</span>
                        </div>
                        <div class="vx-col sm:w-1/3 w-full mb-2">
                            <label for="" class="vs-input--label">Grupo de Clientes*</label>
                            <v-select v-validate="'required'" id="grupoCliente" name="grupoCliente" v-model="grupoCliente" :options="getGrupoClientesSelect"></v-select>
                            
                            <span class="text-danger text-sm">{{ errors.first('grupoCliente') }}</span>
                        </div>
                    </div>
                    <div class="vx-row">
                        <div class="vx-col w-full mb-2">
                            <label for="" class="vs-input--label">Referencias Comerciais</label>
                            <vs-textarea id="referenciaComercial" name="referenciaComercial" v-model="clienteEdit.referenciaComercial"/>
                        </div>
                    </div>
                    <div class="vx-row">
                        <div class="vx-col w-full mb-2">
                            <label for="" class="vs-input--label">Observações</label>
                            <vs-textarea v-model="clienteEdit.observacao"/>
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
                            <!-- <vs-button color="success" class="mr-3 mb-2 pull-right" v-if="!clienteEdit.clienteErp" @click="salvarCliente">Salvar</vs-button> -->
                            <!-- <vs-button color="danger" type="border" class="mr-2 mb-2 pull-right"  @click="cancelarCliente">Voltar</vs-button> -->
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
                                <vs-button type="filled" icon-pack="feather" icon="icon-plus" @click="editarContato(null)" v-if="!clienteEdit.clienteErp">Novo</vs-button>
                            </div>
                        </template>
                        <template slot="thead">
                            <vs-th sort-key="nome">Nome</vs-th>
                            <vs-th sort-key="nome">Cargo</vs-th>
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
                                            <vs-button type="filled" size="small" icon-pack="feather" color="danger" icon="icon-x" @click="deletarContato(data[indextr], indextr)"/>
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
            <vx-card title="Endereços">
                <div id="cliente-endereco-edit" v-if="isEditEndereco">
                    <div class="my-1">
                        <div class="vx-row">
                            <div class="vx-col sm:w-1/4 w-full mb-2">
                                <div class="vs-component vs-con-input-label vs-input w-full vs-input-primary" v-on:keyup.enter="proximoCampo('cadEndereco'), consultaCepEnd(enderecoEdit.cep)">
                                    <label for="cadCepEndereco" class="vs-input--label">CEP*</label>
                                    <div class="vs-con-input">
                                        <the-mask v-validate="'required'" id="cadCepEndereco" name="cadCepEndereco" v-model="enderecoEdit.cep" class="vs-inputx vs-input--input normal hasValue" :mask="['#####-###']" :masked="true"/>
                                    </div>
                                    <span class="text-danger text-sm">{{ errors.first('cadCepEndereco') }}</span>
                                </div>
                            </div>
                            <div class="vx-col sm:w-3/4 w-full mb-2">
                                <vs-input v-validate="'required|alpha_spaces'" label="Endereço*" id="cadEndereco" name="cadEndereco" v-model="enderecoEdit.endereco" class="w-full" v-on:keyup.enter="proximoCampo('cadNumeroEndereco')"/>
                                <span class="text-danger text-sm">{{ errors.first('cadEndereco') }}</span>
                            </div>
                        </div>
                        <div class="vx-row">
                            <div class="vx-col sm:w-1/6 w-full mb-2">
                                <vs-input v-validate="'required|numeric'" label="Numero*" id="cadNumeroEndereco" name="cadNumeroEndereco" v-model="enderecoEdit.numero" class="w-full" v-on:keyup.enter="proximoCampo('cadComplemento')"/>
                                <span class="text-danger text-sm">{{ errors.first('cadNumeroEndereco') }}</span>
                            </div>
                            <div class="vx-col sm:w-1/2 w-full mb-2">
                                <vs-input v-validate="'regex:.'" label="Complemento" id="cadComplemento" name="cadComplemento" v-model="enderecoEdit.complemento" class="w-full" v-on:keyup.enter="proximoCampo('cadBairro')"/>
                                <span class="text-danger text-sm">{{ errors.first('cadComplemento') }}</span>
                            </div>
                            <div class="vx-col sm:w-1/3 w-full mb-2">
                                <vs-input v-validate="'required|alpha_spaces'" label="Bairro*" id="cadBairro" name="cadBairro" v-model="enderecoEdit.bairro" class="w-full" v-on:keyup.enter="proximoCampo('cadCidade')"/>
                                <span class="text-danger text-sm">{{ errors.first('cadBairro') }}</span>
                            </div>
                        </div>
                        <div class="vx-row">
                            <div class="vx-col sm:w-1/3 w-full mb-2">
                                <vs-input v-validate="'required|alpha_spaces'" label="Cidade*" id="cadCidade" name="cadCidade" v-model="enderecoEdit.cidade" class="w-full" v-on:keyup.enter="proximoCampo('cadEstado')"/>
                                <span class="text-danger text-sm">{{ errors.first('cadCidade') }}</span>
                            </div>
                            <div class="vx-col sm:w-1/6 w-full mb-2">
                                <vs-input v-validate="'required|alpha_spaces'" label="Estado*" id="cadEstado" name="cadEstado" v-model="enderecoEdit.estado" class="w-full" v-on:keyup.enter="proximoCampo('cadEnderecoTelefone')"/>
                                <span class="text-danger text-sm">{{ errors.first('cadEstado') }}</span>
                            </div>
                            <div class="vx-col sm:w-1/4 w-full mb-2">
                                <div class="vs-component vs-con-input-label vs-input w-full vs-input-primary">
                                    <label for="cadEnderecoTelefone" class="vs-input--label">Telefone*</label>
                                    <div class="vs-con-input">
                                        <the-mask v-validate="'required'" type="tel" id="cadEnderecoTelefone" name="cadEnderecoTelefone" v-model="enderecoEdit.telefone" class="vs-inputx vs-input--input normal hasValue" :mask="['(##) ####-####', '(##) #####-####']" :masked="true"/>
                                    </div>
                                    <span class="text-danger text-sm">{{ errors.first('cadEnderecoTelefone') }}</span>
                                </div>
                            </div>
                            <div class="mt-5">
                                <vs-checkbox id="endEntrega" name="endEntrega" v-model="enderecoEdit.endEntrega" class="mt-5">Endereço de Entrega</vs-checkbox>
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
                                <vs-button type="filled" icon-pack="feather" icon="icon-plus" @click="editarEndereco(null)" v-if="!clienteEdit.clienteErp">Novo</vs-button>
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
                                            <vs-button type="filled" size="small" name="Editar" icon-pack="feather" color="warning" icon="icon-edit-2" @click="editarEndereco(data[indextr], indextr)" />
                                        </div>
                                        <div class="p-1">
                                            <vs-button type="filled" size="small" icon-pack="feather" color="danger" icon="icon-x" @click="deletarEndereco(data[indextr], indextr)"/>
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
import validatePtBR from '../../rapidsoft/validate/validate_ptBR'
import Datepicker from 'vuejs-datepicker';
import * as lang from "vuejs-datepicker/src/locale";
import vSelect from 'vue-select';
import _ from 'lodash'
import ClienteDB from '../../rapidsoft/db/clienteDB'
import CidadeDB from '../../rapidsoft/db/cidadeDB'
import CidadeService from '../../rapidsoft/service/cidadeService'
import GrupoClienteDB from '../../rapidsoft/db/grupoClienteDB'
import ErrorDB from '../../rapidsoft/db/errorDB'
import SegmentoDB from '../../rapidsoft/db/segmentoDB'

Validator.localize('pt', validatePtBR);

export default {
    data() {
        return {    
            idCliente: null,  
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
            contatoEdit: {},
            enderecoEdit: {},
            isIpad: false,
            isEditContato: false,
            isEditEndereco: false,
            langSettings: lang.ptBR,
            segmentos: [],
            grupoClientes: []
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
        cepCobranca(val) {
            this.clienteEdit.endereco.cep = val;
        },
        segmentosCliente(val) {
            this.clienteEdit.segmentos = val.map((segmento) => {
                return _.toString(segmento.value);
            })
        },

    },
    computed:{
        getFilesFilter() {
            return this.clienteEdit.imagens
        },
        isJuridico() {
            if(this.tipoPessoa == 1) {
                return true;
            } else {
                return false;
            }
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
        getGroupClient(uf){
            return this.grupoClientes.map((item) => {
                item.estados.map((estado) => {
                    if (estado === uf) {
                        return this.grupoCliente = {value: item.id, label: item.nome, padrao: item.padrao} 
                    }
                });
            });
        },
        scrollMeTo(refName) {
            var element = this.$refs[refName];
            var top = element.offsetTop;
            window.scrollTo(0, top);
        },
        proximoCampo(refName) {                  
            document.getElementById(refName).focus();      
            if (refName === "dataAniversario" || refName === "dataFundacao") {
                this.$refs[refName].showCalendar()
            } 
        },
        toBase64(file, callback) {
            const reader = new FileReader();
            reader.readAsDataURL(file); 
            reader.onloadend = function() {
                callback(reader.result)
            }
        },
        onFileChanged(event) {
            let index = 0;
            Array.from(event.target.files).forEach(file => {
                let imagem = {};
                imagem.index = index;
                imagem.name = file.name
                imagem.size = file.size
                imagem.type = file.type
                imagem.lastModified = file.lastModified;
                this.toBase64(file, (imageNase64) => {
                    imagem.base64 = imageNase64;
                    this.clienteEdit.imagens.push(imagem);
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
        editarContato(contato, index) {
            this.isEditContato = true;
            if (contato === null) {
                this.contatoEdit = {};
            } else {
                this.contatoEdit = contato;
                this.clienteEdit.contatos.splice(index, 1);
            }
            setTimeout(() => {
                this.proximoCampo('nomeContato');
            }, 100);
        },
        editarEndereco(endereco, index) {
            this.isEditEndereco = true;
            if (endereco === null) {
                this.enderecoEdit = {};
            } else {
                this.enderecoEdit = endereco;
                this.clienteEdit.enderecos.splice(index, 1)
            }
            setTimeout(() => {
                this.proximoCampo('cadCepEndereco');
            }, 100);
        },
        deletarContato(data, index) {
            this.clienteEdit.contatos.splice(index, 1);
        },
        deletarEndereco(data, index) {
            this.clienteEdit.enderecos.splice(index, 1)
        },
        cancelarContato() {
            this.isEditContato = false;
        },
        cancelarEndereco() {
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
            const endereco = {}
            endereco.cep = cep;
            endereco.endereco = null;
            endereco.bairro = null;
            endereco.cidade = null;
            endereco.estado = null;
            if (navigator.onLine && cep.length === 9) {
                this.$vs.loading();
                CidadeService.buscaEndereco(this.enderecoEdit.cep).then((endereco) =>{
                    if (endereco.id) {
                        CidadeDB.buscaCidade(endereco.id).then((cidade) => {
                            if (cidade.existe && cidade.result.rel === 1) {
                                endereco.cep = cep;
                                endereco.endereco = endereco.e;
                                endereco.bairro = endereco.b;
                                endereco.cidade = cidade.result.nome;
                                endereco.estado = cidade.result.uf;
                            } else {
                                this.erroPermissaoCidade()
                            }
                                this.$set(this.enderecoEdit, 'endereco', endereco.endereco)
                                this.$set(this.enderecoEdit, 'bairro', endereco.bairro)
                                this.$set(this.enderecoEdit, 'cidade', endereco.cidade)
                                this.$set(this.enderecoEdit, 'estado', endereco.estado)
                        })
                    }
                    this.$vs.loading.close();
                })
            } else {
                this.$set(this.enderecoEdit, 'endereco', endereco.endereco);
            }
        },
        consultaCep(cep) {
            const telefone = this.clienteEdit.endereco.telefone
            const endereco = {}
            endereco.cep = cep;
            endereco.endereco = null;
            endereco.bairro = null;
            endereco.cidade = null;
            endereco.estado = null;
            if (navigator.onLine && cep.length === 9) {
                this.$vs.loading();
                CidadeService.buscaEndereco(this.clienteEdit.endereco.cep).then((endereco) =>{
                    if (endereco.id) {
                        CidadeDB.buscaCidade(endereco.id).then((cidade) => {
                            if (cidade.existe && cidade.result.rel === 1) {
                                endereco.telefone = telefone
                                endereco.cep = cep;
                                endereco.endereco = endereco.e;
                                endereco.bairro = endereco.b;
                                endereco.cidade = cidade.result.nome;
                                endereco.estado = cidade.result.uf;
                            } else {
                                this.erroPermissaoCidade()
                            }
                                this.$set(this.clienteEdit, 'endereco', endereco);
                        })
                    }
                    this.$vs.loading.close();
                })
            } else {
                this.$set(this.clienteEdit, 'endereco', endereco);
            }
        },
        salvarContato() {          
            ClienteDB.validarContato(this.contatoEdit).then(() => {
                this.contatoEdit.id = this.contatoEdit.id ? this.contatoEdit.id : 0;
                this.clienteEdit.contatos.push(_.clone(this.contatoEdit));
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
                })
            });
        },
        salvarEndereco() {
            ClienteDB.validarEndereco(_.cloneDeep(this.enderecoEdit)).then((result) => {
                this.clienteEdit.enderecos.push(_.clone(result));
                this.isEditEndereco = false;
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
                })
            });
        },
        salvarCliente() {
            this.$vs.loading();
            const cliente = _.cloneDeep(this.clienteEdit);
            if (cliente.dataFundacao !== undefined) {
                cliente.dataFundacao = cliente.dataFundacao.getTime();
            }
            if (cliente.dataAniversario !== undefined) {
                cliente.dataAniversario = cliente.dataAniversario.getTime();
            }
            setTimeout(() => {  
                ClienteDB.salvar(cliente).then(() => {
                    this.$vs.notify({
                        title: 'Sucesso',
                        text: 'Cliente Salvo!',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                }).catch((erro) => {
                    this.$validator.validate();
                    console.log(erro);
                    
                    if (erro.campo) {
                        this.proximoCampo(erro.campo);
                        console.log(erro.campo)
                    }
                    this.$vs.notify({
                        title: 'Erro!',
                        text: erro.mensagem,
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    })
                });
                this.$vs.loading.close();
            }, 300);
        },
        cancelarCliente() {
            this.$router.push('/cliente/consulta');            
        },

        findById(idCliente) {
            ClienteDB.findById(idCliente).then((cliente) => {

                console.log(cliente);
                
                this.clienteEdit = _.cloneDeep(cliente);
                this.cpfCnpj = this.clienteEdit.cpfCnpj;
                if (_.isNil(this.clienteEdit.grupoCliente)) {
                    this.grupoCliente = _.find(this.getGrupoClientesSelect, (grupo) => { return grupo.padrao });
                } else {
                    this.grupoCliente = _.clone(_.find(this.getGrupoClientesSelect, (grupo) => { return grupo.value === this.clienteEdit.grupoCliente }));
                }
                if (this.clienteEdit.segmentos && this.clienteEdit.segmentos.length > 0) {
                    this.segmentosCliente = _.flattenDeep(this.clienteEdit.segmentos.map((segmentoCliente) => {
                        return _.filter(this.getSegmentosCheckBox, (segmento) => { 
                            return _.toString(segmentoCliente) == _.toString(segmento.value)
                        });
                    }));
                }
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
                callback();
            })
        },
        
    },
    created() {
        if(navigator.platform === "iPad") {
            this.isIpad= true;
        } else {
            this.isIpad= false;
        }
    },
    mounted() {
        this.buscaGrupos(() => {
            this.buscaSegmentos(() => {
                this.idCliente = this.$route.params.clienteId;
                if (this.idCliente) {
                    this.findById(this.idCliente);
                }
            })
        });
    },
    beforeCreate() {
        setTimeout(() => {
            this.proximoCampo('cpfCnpj');
        }, 200);
    },
    errorCaptured(err, vm, info) {
        ErrorDB._criarLog({err, vm, info});
        return true;
    },
    afterMounted() {
        
    }
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
