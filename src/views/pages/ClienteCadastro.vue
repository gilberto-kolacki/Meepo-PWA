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
                        <div class="vx-col sm:w-1/2 w-full mb-2">
                            <div class="vs-component vs-con-input-label vs-input w-full vs-input-primary" v-on:keyup.enter="proximoCampo('nomeCliente')">
                                <label for="" class="vs-input--label">CPF/CNPJ*</label>
                                <div class="vs-con-input">
                                    <the-mask v-validate="'required|min:14'" id="cpfCnpj" name="cpfCnpj" v-model="clienteEdit.cpfCnpj" class="vs-inputx vs-input--input normal hasValue" :mask="['###.###.###-##', '##.###.###/####-##']" :masked="true" />
                                </div>
                                <span class="text-danger text-sm">{{ errors.first('cpfCnpj') }}</span>
                            </div>
                        </div>
                        <div class="vx-col sm:w-1/2 w-full mb-2" v-on:keyup.enter="proximoCampo('razaoSocial')">
                            <vs-input v-validate="'required'" label="Nome*" id="nomeCliente" name="nomeCliente" v-model="clienteEdit.nome" class="w-full" />
                            <span class="text-danger text-sm">{{ errors.first('nomeCliente') }}</span>
                        </div>
                    </div>

                    <div class="vx-row">
                        <div class="vx-col sm:w-1/2 w-full mb-2" v-on:keyup.enter="isJuridico ? proximoCampo('dataFundacao') : proximoCampo('dataAniversario')">
                            <vs-input v-validate=" isJuridico ? 'required' : ''" label="Razão Social*" id="razaoSocial" name="razaoSocial" v-model="clienteEdit.razaoSocial" class="w-full" />
                            <span class="text-danger text-sm">{{ errors.first('razaoSocial') }}</span>
                        </div>
                        <div class="vx-col sm:w-1/2 w-full mb-2" v-if="isJuridico" v-on:keyup.enter="proximoCampo('inscricaoEstadual')">
                            <label for="dataFundacao" class="vs-input--label">Data Fundação*</label>                            
                            <datepicker v-validate="'required'" placeholder="DD/MM/AAAA" v-model="clienteEdit.dataFundacao" format="dd/MM/yyyy" id="dataFundacao" name="dataFundacao" ref="dataFundacao" :language="langSettings" :disabledDates="disabledDates" wrapper-class="w-full" input-class="vs-inputx vs-input--input normal"/>
                            <span class="text-danger text-sm">{{ errors.first('dataFundacao') }}</span>
                        </div>
                        <div class="vx-col sm:w-1/2 w-full mb-2" v-else v-on:keyup.enter="proximoCampo('registroGeral')" >
                            <label for="dataAniversario" class="vs-input--label">Data Aniversário*</label>                            
                            <datepicker v-validate="'required'" placeholder="DD/MM/AAAA" v-model="clienteEdit.dataAniversario" format="dd/MM/yyyy" id="dataAniversario" name="dataAniversario" ref="dataAniversario" :language="langSettings" :disabledDates="disabledDates" wrapper-class="w-full" input-class="vs-inputx vs-input--input normal"/>
                            <span class="text-danger text-sm">{{ errors.first('dataAniversario') }}</span>
                        </div>
                    </div>

                    <div class="vx-row">
                        <div class="vx-col sm:w-1/2 w-full mb-2" v-if="isJuridico">
                            <div class="vs-component vs-con-input-label vs-input w-full vs-input-primary" v-on:keyup.enter="proximoCampo('emailNfe')">
                                <label for="inscricaoEstadual" class="vs-input--label">Inscrição Estadual*</label>
                                <the-mask v-validate="'required'" id="inscricaoEstadual" name="inscricaoEstadual" v-model="clienteEdit.inscricaoEstadual" class="vs-inputx vs-input--input normal hasValue" :mask="['##############']" :masked="true" />
                                <span class="text-danger text-sm">{{ errors.first('inscricaoEstadual') }}</span>
                            </div>
                        </div>
                        <div class="vx-col sm:w-1/2 w-full mb-2" v-else v-on:keyup.enter="proximoCampo('emailNfe')">
                            <div class="vs-component vs-con-input-label vs-input w-full vs-input-primary">
                                <label for="registroGeral" class="vs-input--label">RG*</label>
                                <div class="vs-con-input">
                                    <the-mask v-validate="'required'" id="registroGeral" name="registroGeral" v-model="clienteEdit.registroGeral" class="vs-inputx vs-input--input normal hasValue" :mask="['#.###.###-#', '##.###.###-#', '#.###.###']" :masked="true" />
                                </div>
                                <span class="text-danger text-sm">{{ errors.first('registroGeral') }}</span>
                            </div>
                        </div>
                        <div class="vx-col sm:w-1/2 w-full mb-2" v-if="clienteEdit.segmentos.length > 0">
                            <ul class="demo-alignment" id="segmento">
                                <li v-for="(segmento, index) in clienteEdit.segmentos" :key="`segmento-cliente-${index}`">
                                    <vs-checkbox v-validate="'required'" name = "segmento" v-model="clienteEdit.segmentos[index].ativo" onFocus="value" value="okay">{{clienteEdit.segmentos[index].name}}</vs-checkbox>
                                </li>
                            </ul>
                            <span class="text-danger text-sm">{{ errors.first('segmento') }}</span>
                        </div>
                    </div>
                    <div class="vx-row">
                        <div class="vx-col sm:w-1/2 w-full mb-2">
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
                        <div class="vx-col sm:w-1/4 w-full mb-2">
                            <div class="vs-component vs-con-input-label vs-input w-full vs-input-primary" v-on:keyup.enter="proximoCampo('endereco')">
                                <label for="cepEndereco" class="vs-input--label">CEP*</label>
                                <div class="vs-con-input">
                                    <the-mask v-validate="'required'" id="cepEndereco" name="cepEndereco" v-model="clienteEdit.endereco.cep" class="vs-inputx vs-input--input normal hasValue" :mask="['#####-###']" :masked="true" v-on:keyup.enter="proximoCampo('endereco')" />
                                </div>
                                <span class="text-danger text-sm">{{ errors.first('cepEndereco') }}</span>
                            </div>
                        </div>
                        <div class="vx-col sm:w-3/4 w-full mb-2">
                            <vs-input v-validate="'required|alpha_spaces'" label="Endereço*" id="endereco" name="endereco" v-model="clienteEdit.endereco.endereco" class="w-full" v-on:keyup.enter="proximoCampo('numeroEndereco')"/>                                
                            <span class="text-danger text-sm">{{ errors.first('endereco') }}</span>
                        </div>
                    </div>
                    <div class="vx-row">
                        <div class="vx-col sm:w-1/6 w-full mb-2">
                            <vs-input v-validate="'required'" label="Numero*" id="numeroEndereco" name="numeroEndereco" v-model="clienteEdit.endereco.numero" class="w-full" v-on:keyup.enter="proximoCampo('complemento')"/>
                            <span class="text-danger text-sm">{{ errors.first('numeroEndereco') }}</span>
                        </div>
                        <div class="vx-col sm:w-1/2 w-full mb-2">
                            <vs-input v-validate="'alpha_spaces'" label="Complemento" id="complemento" name="complemento" v-model="clienteEdit.endereco.complemento" class="w-full" v-on:keyup.enter="proximoCampo('bairro')"/>
                            <span class="text-danger text-sm">{{ errors.first('complemento') }}</span>
                        </div>
                        <div class="vx-col sm:w-1/3 w-full mb-2">
                            <vs-input v-validate="'required|alpha_spaces'" label="Bairro*" id="bairro" name="bairro" v-model="clienteEdit.endereco.bairro" class="w-full" v-on:keyup.enter="proximoCampo('cidade')"/>
                            <span class="text-danger text-sm">{{ errors.first('bairro') }}</span>
                        </div>
                    </div>
                    <div class="vx-row">
                        <div class="vx-col sm:w-1/2 w-full mb-2">
                            <vs-input v-validate="'required|alpha_spaces'" label="Cidade*" id="cidade" name="cidade" v-model="clienteEdit.endereco.cidade" class="w-full" v-on:keyup.enter="proximoCampo('estado')"/>
                            <span class="text-danger text-sm">{{ errors.first('cidade') }}</span>
                        </div>
                        <div class="vx-col sm:w-1/6 w-full mb-2">
                            <vs-input v-validate="'required|alpha_spaces'" label="Estado*" id="estado" name="estado" v-model="clienteEdit.endereco.estado" class="w-full" v-on:keyup.enter="proximoCampo('enderecoTelefone')"/>
                            <span class="text-danger text-sm">{{ errors.first('estado') }}</span>
                        </div>
                        <div class="vx-col sm:w-1/3 w-full mb-2">
                            <label for="" class="vs-input--label">Grupo de Clientes*</label>
                            <v-select v-validate="'required'" id="grupoCliente" name="grupoCliente" v-model="clienteEdit.grupoCliente" :options="grupoClientes"></v-select>
                            <span class="text-danger text-sm">{{ errors.first('grupoCliente') }}</span>
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
                                        <img :src="getBase64(imagenCliente)" style="max-width: none; max-height: 100%;" />
                                    </div>
                                    <div class="con-input-upload">
                                        <input type="file" multiple="multiple" accept="image/*" @change="onFileChanged" :disabled="clienteEdit.imagensClienteBlob.length >= 1000"/>
                                        <span class="text-input">Selecione as Imagens</span>                                
                                        <button type="button" title="Upload" class="btn-upload-all vs-upload--button-upload" :disabled="clienteEdit.imagensClienteBlob.length >= 5">
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
                            <vs-button color="danger" type="border" class="mb-2 pull-right" @click="cancelarCliente">Voltar</vs-button>
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
                                <vs-input v-validate="'required|alpha_spaces'" label="Nome Contato*" id="nomeContato" name="nomeContato" v-model="contatoEdit.nome" class="w-full" v-on:keyup.enter="proximoCampo('funcao')"/>
                                <span class="text-danger text-sm">{{ errors.first('nomeContato') }}</span>
                            </div>
                            <div class="vx-col sm:w-1/2 w-full mb-2">
                                <vs-input v-validate="'required|alpha_spaces'" label="Função*" id="funcao" name="funcao" v-model="contatoEdit.funcao" class="w-full" v-on:keyup.enter="proximoCampo('telefoneContato')"/>
                                <span class="text-danger text-sm">{{ errors.first('funcao') }}</span>
                            </div>
                        </div>
                        <div class="vx-row">
                            <div class="vx-col sm:w-1/2 w-full mb-2">
                                <div class="vs-component vs-con-input-label vs-input w-full vs-input-primary" v-on:keyup.enter="proximoCampo('celularContato')">
                                    <label for="" class="vs-input--label">Telefone*</label>
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
                                <vs-input v-validate="'required|email'" label="E-mail*" id="emailContato" name="emailContato" v-model="contatoEdit.email" class="w-full" type="email" />
                                <span class="text-danger text-sm">{{ errors.first('emailContato') }}</span>
                            </div>
                        </div>
                         <div class="vx-row">
                            <div class="vx-col my-5-top w-full">
                                <vs-button color="success" class="mr-3 mb-2 pull-right" @click="salvarContato">Salvar</vs-button>
                                <vs-button color="danger" type="border" class="mb-2 pull-right" @click="cancelarContato">Voltar</vs-button>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="cliente-contato-list" v-else>
                    <vs-table max-items="5" :data="clienteEdit.contatos">            
                        <template slot="header">
                            <div class="mb-base-button">
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
            <vx-card title="Endereços">
                <div id="cliente-endereco-edit" v-if="isEditEndereco">
                    <div class="my-1">
                        <div class="vx-row">
                            <div class="vx-col sm:w-1/4 w-full mb-2">
                                <label for="cadCepEndereco" class="vs-input--label">CEP*</label>
                                <div class="vs-con-input">
                                    <the-mask v-validate="'required'" id="cadCepEndereco" name="cadCepEndereco" v-model="enderecoEdit.cep" class="vs-inputx vs-input--input normal hasValue" :mask="['#####-###']" :masked="true" v-on:keyup.enter="proximoCampo('cadEndereco')"/>
                                </div>
                                <span class="text-danger text-sm">{{ errors.first('cadCepEndereco') }}</span>
                            </div>
                            <div class="vx-col sm:w-3/4 w-full mb-2">
                                <vs-input v-validate="'required|alpha_spaces'" label="Endereço*" id="cadEndereco" name="cadEndereco" v-model="enderecoEdit.endereco" class="w-full" v-on:keyup.enter="proximoCampo('cadNumeroEndereco')"/>                                
                                <span class="text-danger text-sm">{{ errors.first('cadEndereco') }}</span>
                            </div>
                        </div>
                        <div class="vx-row">
                            <div class="vx-col sm:w-1/6 w-full mb-2">
                                <vs-input v-validate="'required'" label="Numero*" id="cadNumeroEndereco" name="cadNumeroEndereco" v-model="enderecoEdit.numero" class="w-full" v-on:keyup.enter="proximoCampo('cadComplemento')"/>
                                <span class="text-danger text-sm">{{ errors.first('cadNumeroEndereco') }}</span>
                            </div>
                            <div class="vx-col sm:w-1/2 w-full mb-2">
                                <vs-input v-validate="'alpha_spaces'" label="Complemento" id="cadComplemento" name="cadComplemento" v-model="enderecoEdit.complemento" class="w-full" v-on:keyup.enter="proximoCampo('cadBairro')"/>
                                <span class="text-danger text-sm">{{ errors.first('cadComplemento') }}</span>
                            </div>
                            <div class="vx-col sm:w-1/3 w-full mb-2">
                                <vs-input v-validate="'required|alpha_spaces'" label="Bairro*" id="cadBairro" name="cadBairro" v-model="enderecoEdit.bairro" class="w-full" v-on:keyup.enter="proximoCampo('cadCidade')"/>
                                <span class="text-danger text-sm">{{ errors.first('cadBairro') }}</span>
                            </div>
                        </div>
                        <div class="vx-row">
                            <div class="vx-col sm:w-1/2 w-full mb-2">
                                <vs-input v-validate="'required|alpha_spaces'" label="Cidade*" id="cadCidade" name="cadCidade" v-model="enderecoEdit.cidade" class="w-full" v-on:keyup.enter="proximoCampo('cadEstado')"/>
                                <span class="text-danger text-sm">{{ errors.first('cadCidade') }}</span>
                            </div>
                            <div class="vx-col sm:w-1/6 w-full mb-2">
                                <vs-input v-validate="'required|alpha_spaces'" label="Estado*" id="cadEstado" name="cadEstado" v-model="enderecoEdit.estado" class="w-full" v-on:keyup.enter="proximoCampo('cadEnderecoTelefone')"/>
                                <span class="text-danger text-sm">{{ errors.first('cadEstado') }}</span>
                            </div>
                            <div class="vx-col sm:w-1/3 w-full mb-2">
                                <div class="vs-component vs-con-input-label vs-input w-full vs-input-primary">
                                    <label for="cadEnderecoTelefone" class="vs-input--label">Telefone*</label>
                                    <div class="vs-con-input">
                                        <the-mask v-validate="'required'" type="tel" id="cadEnderecoTelefone" name="cadEnderecoTelefone" v-model="enderecoEdit.telefone" class="vs-inputx vs-input--input normal hasValue" :mask="['(##) ####-####', '(##) #####-####']" :masked="true"/>
                                    </div>
                                    <span class="text-danger text-sm">{{ errors.first('cadEnderecoTelefone') }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="vx-row">
                            <div class="vx-col my-5-top w-full">
                                <vs-button color="success" class="mr-3 mb-2 pull-right" @click="salvarEndereco">Salvar</vs-button>
                                <vs-button color="danger" type="border" class="mb-2 pull-right" @click="cancelarEndereco">Voltar</vs-button>
                            </div>
                        </div>                        
                    </div>                    
                </div>
                <div id="cliente-endereco-list" v-else>
                    <vs-table max-items="5" :data="clienteEdit.enderecos">            
                        <template slot="header">
                            <div class="mb-base-button">
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
                                        <div class="p-1">
                                            <vs-button type="filled" size="small" icon-pack="feather" color="danger" icon="icon-x" @click="deletarEndereco(data[indextr])"/>
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

Validator.localize('pt', validatePtBR);

export default {
    data() {
        return {    
            idCliente: null,    
            clienteEdit: {
                endereco: {},
                contatos: [],
                enderecos: [],
                imagensClienteBlob: [],
                segmentos: [
                    {name: 'Beach', ativo: false},
                    {name: 'Fitness', ativo: false}
                ]
            },
            contatoEdit: {},
            enderecoEdit: {}, 
            isIpad: false,     
            isEditContato: false,
            isEditEndereco: false,
            langSettings: lang.ptBR,
            segmentos: ['foo','bar'],
            grupoClientes: ['Grupo 1', 'Grupo 2'],
            disabledDates: {            
                from: new Date(), // Disable all dates after specific date                
            }
        }
    },
    components: {
        Datepicker,        
        'v-select': vSelect,
    },
    watch:{

    },
    computed:{
        getFilesFilter() {
            // let files = this.clienteEdit.imagensClienteBlob.filter((item) => {
            //     return !item.remove
            // })
            return this.clienteEdit.imagensClienteBlob
        },
        isJuridico() {
            if(this.clienteEdit.cpfCnpj && this.clienteEdit.cpfCnpj.length > 14) {
                return true;
            } else {
                return false;
            }
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
            if (refName === "dataAniversario" || refName === "dataFundacao") {
                this.$refs[refName].showCalendar()
            } 
        },
        getBase64(imagem) {
            return URL.createObjectURL(imagem.file);
        },
        toBase64(file) {
            return new Promise((resolve) => {
                let reader = new FileReader();
                reader.onload = () => {
                    resolve(reader.result);
                };
                reader.readAsDataURL(file);
            });
        },
        onFileChanged(event) {
            for (let index = 0; index < event.target.files.length; index++) {
                let imagem = {};
                imagem.file = event.target.files[index];
                imagem.index = index;
                this.clienteEdit.imagensClienteBlob.push(imagem);
            }            
        },
        removeImageCliente(index) {
            for( var i = 0; i < this.clienteEdit.imagensClienteBlob.length; i++){ 
                if (this.clienteEdit.imagensClienteBlob[i] === this.clienteEdit.imagensClienteBlob[index]) {
                    this.clienteEdit.imagensClienteBlob.splice(i, 1); 
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
                this.proximoCampo('cadCepEndereco');
            }, 100);
        },
        deletarContato() {

        },
        deletarEndereco() {

        },
        cancelarContato() {
            this.isEditContato = false;
        },
        cancelarEndereco() {
            this.isEditEndereco = false;
        },
        salvarContato() {        
            ClienteDB.validarContato(_.cloneDeep(this.contatoEdit)).then(() => {
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
            let cliente = _.cloneDeep(this.clienteEdit);
            setTimeout(() => {  
                ClienteDB.salvar2(cliente).then(() => {
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
            ClienteDB.findById(idCliente).then((result) => {
                this.clienteEdit = _.cloneDeep(result);
            });
        },
        
    },
    created() {
        this.disabledDates.from = new Date(new Date().getFullYear(), new Date().getMonth()-1, new Date().getDate());
        if(navigator.platform === "iPad") {
            this.isIpad= true;
        } else {
            this.isIpad= false;
        }
    },
    mounted() {
        this.idCliente = this.$route.params.clienteId;
        if (this.idCliente) {
            this.findById(this.idCliente);
        }
    },
    beforeCreate() {
        setTimeout(() => {
            this.proximoCampo('cpfCnpj');
        }, 200);
    }
}

</script>

<style>

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

</style>
