<script>
import axios from 'axios';
import { useTradeStore } from '../stores/store';
import { useRegisterStore } from '../stores/store';
import { mapActions, mapState } from 'pinia';

export default {
    name: 'SellPage',
    data() {
        return {
            sellQuantity: ''
        }
    },
    computed: {
        ...mapState(useTradeStore, ['binanceMarketPrice', 'commodityInfo', 'closedTrades']),
        ...mapState(useRegisterStore, ['profile'])
    },
    methods: {
        ...mapActions(useTradeStore, ['sellCrypto', 'fetchCommodityById', 'fetchClosedTrade']),
    },
    async created() {
        await this.fetchCommodityById(this.$route.params.id)
        await this.fetchClosedTrade()

    }
}
</script>

<template>
    <main class="main-content position-relative max-height-vh-100 h-100 border-radius-lg ">
        <!-- Navbar -->
        <nav class="navbar navbar-main navbar-expand-lg mx-5 px-0 shadow-none rounded" id="navbarBlur" navbar-scroll="true">
            <div class="container-fluid py-1 px-2">
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb bg-transparent mb-1 pb-0 pt-1 px-0 me-sm-6 me-5">
                        <li class="breadcrumb-item text-sm">Dashboard</li>
                        <li class="breadcrumb-item text-sm">Trading</li>
                        <li class="breadcrumb-item text-sm text-dark active" aria-current="page">Sell Crypto</li>
                    </ol>
                    <h6 class="font-weight-bold mb-0">Sell Crypto</h6>
                </nav>
                <div class="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4" id="navbar">
                    <div class="ms-md-auto pe-md-3 d-flex align-items-center">
                        <div class="input-group">
                        </div>
                    </div>

                </div>
            </div>
        </nav>
        <!-- End Navbar -->
        <div class="container-fluid py-4 px-5">
            <div class="row">
                <div class="col-12">
                    <div class="card border shadow-xs mb-4">
                        <div class="card-header border-bottom pb-0">
                            <div class="d-sm-flex align-items-center mb-3">
                                <div>
                                    <h6 class="font-weight-semibold text-lg mb-0">Sell Order</h6>
                                    <p class="text-sm mb-sm-0">Enter the quantity, and click sell</p>
                                </div>
                            </div>
                        </div>
                        <div class="card-body px-0 py-0">
                            <div class="row d-flex justify-content-center py-3 px-4">
                                <div class="table-responsive p-0 col-6 border rounded me-4">
                                    <h6 class="font-weight-semibold text-lg my-3 text-center">Latest Closed Trade</h6>
                                    <table class="table align-items-center mb-0">
                                        <thead class="bg-gray-100">
                                            <tr>
                                                <th class="text-sm text-dark font-weight-semibold text-center">#</th>
                                                <th class="text-sm text-dark font-weight-semibold">Name</th>
                                                <th class="text-sm text-dark font-weight-semibold">Sell Price</th>
                                                <th class="text-sm text-dark font-weight-semibold">Sell Amount</th>
                                                <th class="text-sm text-dark font-weight-semibold">Realised Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(trade, idx) in closedTrades" :key="trade.id">
                                                <td class="text-center">
                                                    <span class="text-secondary text-sm font-weight-bold">{{ idx + 1
                                                    }}</span>
                                                </td>
                                                <td>
                                                    <div class="d-flex px-2 py-1">
                                                        <div class="d-flex align-items-center">
                                                            <img :src="trade.Commodity.imageUrl"
                                                                class="avatar avatar-sm rounded-circle me-2" alt="user1">
                                                        </div>
                                                        <div class="d-flex flex-column justify-content-center ms-1">
                                                            <h6 class="mb-0 text-sm font-weight-semibold">{{
                                                                trade.Commodity.name }}</h6>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td class="align-middle text-center">
                                                    <p class="text-sm text-dark font-weight-semibold mb-0">{{
                                                        trade.sellPrice }}</p>
                                                </td>
                                                <td class="align-middle text-center">
                                                    <p class="text-sm text-dark font-weight-semibold mb-0">{{
                                                        trade.amount.toLocaleString("id-ID", {
                                                            style:
                                                                "currency", currency: "IDR"
                                                        }) }}
                                                    </p>
                                                </td>
                                                <td class="align-middle text-center">
                                                    <p class="text-sm text-primary font-weight-semibold mb-0">
                                                        {{
                                                            trade.realisedAmount.toLocaleString("id-ID", {
                                                                style:
                                                                    "currency", currency: "IDR"
                                                            }) }}
                                                    </p>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="table-responsive p-0 col-5 border rounded ms-4">
                                    <div class="container p-5 col-10">
                                        <h2 class="mb-5">Sell Summary</h2>
                                        <div class="mb-3">
                                            <h5>Asset name: {{ commodityInfo.name }}</h5>
                                        </div>
                                        <form role="form" @submit.prevent="sellCrypto(this.$route.params.id, sellQuantity)">
                                            <label>Sell quantity</label>
                                            <div class="mb-3">
                                                <input v-model="sellQuantity" type="float" class="form-control"
                                                    placeholder="Enter your amount">
                                            </div>

                                            <div class="mb-3">
                                                <h5>Total amount : {{ (+this.binanceMarketPrice *
                                                    +sellQuantity).toLocaleString("id-ID", {
                                                        style:
                                                            "currency", currency: "IDR"
                                                    }) }}</h5>
                                            </div>
                                            <div class="text-center col-3">
                                                <button type="submit" class="btn btn-dark w-100 mt-4 mb-3">Sell</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <footer class="footer pt-3  ">
                <div class="container-fluid">
                    <div class="row align-items-center justify-content-lg-between">
                        <div class="col-lg-6 mb-lg-0 mb-4">
                            <div class="copyright text-center text-xs text-muted text-lg-start">
                                Copyright © 2023
                                PasarKoin. Design by
                                <a href="https://www.creative-tim.com" class="text-secondary" target="_blank">Creative
                                    Tim</a>.
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    </main>
</template>