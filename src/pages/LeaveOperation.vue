<template>
  <q-layout>
    <q-page> 
      <q-page-container>
        <div class="containermainn">
          <div class="row" style="width: 90%;">
            
            <!-- Pending Leaves -->
            <div class="col-12">
              <q-card class="roundedd1">
                <template v-if="$q.screen.width > 900">
                  <q-card-section v-if="!loading" class="bg-primary text-white text-h6 text-center"
                    :style="{
                      fontWeight: 'bold',
                      fontSize: $q.screen.lt.sm ? '16px' : ($q.screen.lt.md ? '18px' : ($q.screen.gt.md && $q.screen.lt.xl ? '20px' : '18px'))
                    }"
                  >
                    <div class="row">
                      <div class="col-4"></div>
                      <div class="col-4 text-center">
                        Pending Leaves
                      </div>
                      <div class="col-4 text-right">
                        <q-btn-dropdown icon="search" label="search" class="bg-white text-blue">
                          <q-input class="text-blue" style="font-size: 15px;"
                            v-model="searchTextPending"
                            placeholder="Search"
                            dense
                            outlined
                            clearable
                            :style="{ width: '250px', marginLeft: 'auto', 
                              fontSize: $q.screen.lt.sm ? '8px' :
                              ($q.screen.lt.md ? '10px' :
                              ($q.screen.lt.lg ? '12px' : '15px'))
                            }"
                            @clear="clearSearchText"
                          />
                        </q-btn-dropdown>
                      </div>
                    </div>
                  </q-card-section>
                  <q-skeleton v-else :style="{ height: '65px' }" />

                  <!-- Q-Skeleton Loading -->
                  <template v-if="loading">
                    <template v-for="rowIndex in 1" :key="rowIndex">
                      <div style="display: flex; justify-content: space-between; align-items: center; height: 50px; background-color: #f2f2ef;">
                        <template v-for="colIndex in 7" :key="colIndex">
                          <div style="flex: 1; display: flex; justify-content: center;">
                            <q-skeleton :style="{ height: '15px', width: '70%' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'"/>
                          </div>
                        </template>
                      </div>
                    </template>
                    <template v-for="rowIndex in 7" :key="rowIndex">
                      <div style="display: flex; justify-content: space-between; align-items: center; height: 50px;">
                        <template v-for="colIndex in 7" :key="colIndex">
                          <div style="flex: 1; display: flex; justify-content: center;">
                            <q-skeleton :style="{ height: '35px', width: '85%' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'" />
                          </div>
                        </template>
                      </div>
                    </template>
                  </template>
                  <template v-else>
                    <q-virtual-scroll
                      class="virtual-scroll"
                      type="table"
                      style="max-height: 450px"
                      :virtual-scroll-item-size="48"
                      :virtual-scroll-sticky-size-start="48"
                      :virtual-scroll-sticky-size-end="32"
                      :items="sortedPendingLeave"
                    >
                      <template v-slot:before>
                        <thead class="sticky-thead">
                          <tr>
                            <th v-for="col in pendingcolumns" :key="col.name">
                              {{ col.name }}
                            </th>
                          </tr>
                        </thead>
                      </template>
                      <template v-slot="{ item: row, Name }">
                        <q-tr :key="Name">
                          <q-td v-for="col in pendingcolumns" :key="col.Name" class="text-center" :style="{ width: col.width || 'auto' }">
                            {{ col.field === 'LeaveType' ? LeaveTypeLabels[row[col.field]] : col.field === 'DateFrom' || col.field === 'DateTo' ? formatDateTime(row[col.field]) : row[col.field] }}
                            <template v-if="col.name === 'Actions'">
                              <div class="actions-column">
                                <q-card style="width: 100%;">
                                  <q-btn
                                    @click="approveLeave(row.LeaveID)"
                                    icon="check_circle"
                                    color="green"
                                    label="Approve"
                                    class="q-mr-xs"
                                    style="width: 100%;"
                                  />
                                </q-card>
                                <q-card style="width: 100%; margin-top: 5px">
                                  <q-btn
                                    @click="rejectLeave(row.LeaveID)"
                                    icon="cancel"
                                    color="negative"
                                    label="Reject"
                                    style="width: 100%;"
                                  />
                                </q-card>
                              </div>
                            </template>
                          </q-td>
                        </q-tr>
                      </template>
                    </q-virtual-scroll>
                    <div v-if="sortedPendingLeave.length === 0" class="text-center">
                      <q-icon name="warning" style="font-size: 30px;" />
                      No data available
                    </div>
                  </template>
                </template>

                <!-- Q-table for Q-Card responsive -->
                <template v-else>
                  <!-- Q-Skeleton Loading -->
                  <q-card-section v-if="!loading" class="bg-primary text-white text-h6 text-center"
                    :style="{
                      fontWeight: 'bold',
                      fontSize: $q.screen.lt.sm ? '18px' :
                        ($q.screen.lt.md ? '20px' :
                          ($q.screen.lt.lg ? '22px' : '24px')),
                    }"
                  >
                    Pending Leaves
                  </q-card-section>
                  <q-skeleton v-else :style="{ height: '65px' }" />

                  <template v-if="loading">
                    <div class="q-pa-xs col-12 grid-style-transition">
                      <q-card bordered flat>
                        <template v-for="index in 6" :key="index">
                          <div style="display: flex; justify-content: space-between; width: 100%; padding: 5px 5px 5px;">
                            <q-skeleton :style="{ height: '25px', width: '120px' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'"/>
                            <q-skeleton :style="{ height: '25px', width: '135px' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'"/>
                          </div>
                        </template>
                        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 5px 5px 5px;">
                          <q-skeleton :style="{ height: '25px', width: '120px' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'"/>
                          <div>
                            <q-skeleton :style="{ height: '30px', width: '135px' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'"/>
                            <q-skeleton :style="{ height: '30px', width: '135px' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'"/>
                          </div>
                        </div>
                      </q-card>
                    </div>
                  </template>
                  <template v-else>
                    <q-input
                      v-model="searchTextPending"
                      placeholder="Search"
                      dense
                      outlined
                      clearable
                      :style="{ width: 'auto', marginLeft: 'auto', 
                        fontSize: $q.screen.lt.sm ? '12px' :
                          ($q.screen.lt.md ? '14px' :
                            ($q.screen.lt.lg ? '16px' : '18px'))
                      }"
                      @clear="clearSearchText"
                    >
                      <template v-slot:append>
                        <q-icon name="search" />
                      </template>
                    </q-input>
                    <q-table
                      v-if="sortedPendingLeave.length > 0"
                      grid
                      flat
                      bordered
                      card-class="bg-primary text-white"
                      :rows="sortedPendingLeave"
                      :columns="pendingcolumns"
                      row-key="LeaveID"
                      hide-header
                      hide-pagination
                      style="max-height: 450px; overflow-y: auto;"
                      class="virtual-scroll"
                    >
                      <template v-slot:item="props">
                        <div class="q-pa-xs col-12 grid-style-transition">
                          <q-card bordered flat :class="props.selected ? ($q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2') : 'bg-light-gray text-black'">
                            <q-list dense>
                              <q-item v-for="col in props.cols.filter(col => col.name !== 'desc')" :key="col.name">
                                <q-item-section>
                                  <q-item-label>{{ col.label + ':' }}</q-item-label>
                                </q-item-section>
                                <template v-if="col.name === 'Actions'">
                                  <q-item-section side>
                                    <div class="insideCard">
                                      <q-card style="width: 100%;">
                                        <q-btn
                                          @click="approveLeave(props.row.LeaveID)"
                                          icon="check_circle"
                                          color="green"
                                          label="Approve"
                                          class="q-mr-xs"
                                          style="width: 100%;"
                                        />
                                      </q-card>
                                      <q-card style="width: 100%; margin-top: 5px">
                                        <q-btn
                                          @click="rejectLeave(props.row.LeaveID)"
                                          icon="cancel"
                                          color="negative"
                                          label="Reject"
                                          style="width: 100%;"
                                        />
                                      </q-card>
                                    </div>
                                  </q-item-section>
                                </template>
                                <template v-else>
                                  <q-item-section side>
                                    <q-item-label caption style="font-weight: bold;">
                                      {{
                                        col.field === 'DateFrom' || col.field === 'DateTo'
                                          ? formatDateTime(props.row[col.field])
                                          : col.field === 'LeaveType'
                                          ? LeaveTypeLabels[props.row[col.field]]
                                          : props.row[col.field]
                                      }}
                                    </q-item-label>
                                  </q-item-section>
                                </template>
                              </q-item>
                            </q-list>
                          </q-card>
                        </div>
                      </template>
                    </q-table>
                    <div v-if="sortedPendingLeave.length === 0" class="text-center">
                      <q-icon name="warning" style="font-size: 25px"/>
                      No data availabe
                    </div>
                  </template>
                </template>
              </q-card>
            </div>


            <!-- Toggle for Approved and Rejected Leaves -->
            <div class="col-12">
              <div class="q-mb-md text-h6 text-center">
                <q-skeleton
                  v-if="loading"
                  class="q-mx-auto q-mt-md q-mb-md"
                  :style="{ height: '35px', width: '195px' }"
                  :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'"
                />
                <q-btn
                  v-else
                  @click="toggleLeavesTable"
                  :label="showApprovedLeaves ? 'Show Rejected Leaves' : 'Show Approved Leaves'"
                  color="primary"
                />
              </div>
            </div>


            <!-- Approved Leaves -->
            <div class="col-12">
              <q-card v-show="showApprovedLeaves" class="rounded">
                <template v-if="$q.screen.width > 900">
                  <q-card-section v-if="!loading" class="bg-primary text-white text-h6 text-center"
                    :style="{
                      fontWeight: 'bold',
                      fontSize: $q.screen.lt.sm ? '16px' : ($q.screen.lt.md ? '18px' : ($q.screen.gt.md && $q.screen.lt.xl ? '20px' : '18px'))
                    }"
                  >
                    <div class="row">
                      <div class="col-4"></div>
                      <div class="col-4 text-center">
                        Approved Leaves
                      </div>
                      <div class="col-4 text-right">
                        <q-btn-dropdown icon="search" label="search" class="bg-white text-blue" >
                          <q-input class="text-blue" style="font-size: 15px;"
                            v-model="searchTextApproved"
                            placeholder="Search"
                            dense
                            outlined
                            clearable
                            :style="{ width: '250px', marginLeft: 'auto', 
                              fontSize: $q.screen.lt.sm ? '8px' :
                              ($q.screen.lt.md ? '10px' :
                              ($q.screen.lt.lg ? '12px' : '15px'))
                            }"
                            @clear="clearSearchText"
                          />
                        </q-btn-dropdown>
                      </div>
                    </div>
                  </q-card-section>
                  <q-skeleton v-else :style="{ height: '55px' }" />

                  <!-- Q-Skeleton Loading -->
                  <template v-if="loading">
                    <template v-for="rowIndex in 1" :key="rowIndex">
                      <div style="display: flex; justify-content: space-between; align-items: center; height: 50px; background-color: #f2f2ef;">
                        <template v-for="colIndex in 7" :key="colIndex">
                          <div style="flex: 1; display: flex; justify-content: center;">
                            <q-skeleton :style="{ height: '15px', width: '70%' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'" />
                          </div>
                        </template>
                      </div>
                    </template>
                    <template v-for="rowIndex in 7" :key="rowIndex">
                      <div style="display: flex; justify-content: space-between; align-items: center; height: 50px;">
                        <template v-for="colIndex in 7" :key="colIndex">
                          <div style="flex: 1; display: flex; justify-content: center;">
                            <q-skeleton :style="{ height: '35px', width: '85%' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'" />
                          </div>
                        </template>
                      </div>
                    </template>
                  </template>
                  <template v-else>
                    <q-virtual-scroll
                      class="virtual-scroll"
                      type="table"
                      style="max-height: 450px"
                      :virtual-scroll-item-size="48"
                      :virtual-scroll-sticky-size-start="48"
                      :virtual-scroll-sticky-size-end="32"
                      :items="sortedapprovedLeaves"
                    >
                      <template v-slot:before>
                        <thead class="sticky-thead">
                          <tr>
                            <th v-for="col in approvedcolumns" :key="col.name">
                              {{ col.name }}
                            </th>
                          </tr>
                        </thead>
                      </template>
                      <template v-slot="{ item: row, Name }">
                        <q-tr :key="Name">
                          <q-td v-for="col in approvedcolumns" :key="col.Name" class="text-center" :style="{ width: col.width || 'auto' }">
                            {{ col.field === 'LeaveType' ? LeaveTypeLabels[row[col.field]] : col.field === 'DateFrom' || col.field === 'DateTo' ? formatDateTime(row[col.field]) : row[col.field] }}
                            <q-item-section side v-if="col.name === 'Actions/Status'">
                              <template v-if="row.Status === 'Approved'">
                                <q-card style="width: 100%; margin-bottom: 5px">
                                  <q-card-section class="bg-positive text-white text-h6 text-center" style="line-height: 25%;">
                                    Approved
                                  </q-card-section>
                                </q-card>
                                <q-card class="bg-positive text-white" style="width: 100%;">
                                  <PDFGen :entry="row" />
                                </q-card>
                              </template>
                            </q-item-section>
                          </q-td>
                        </q-tr>
                      </template>
                    </q-virtual-scroll>
                    <div v-if="sortedapprovedLeaves.length === 0" class="text-center">
                      <q-icon name="warning" style="font-size: 30px;" />
                        No data available
                    </div>
                  </template>
                  
                </template>

                <!-- Q-table for Q-Card responsive -->
                <template v-else>
                  <!-- Q-Skeleton Loading -->
                  <q-card-section v-if="!loading" class="bg-primary text-white text-h6 text-center"
                    :style="{
                      fontWeight: 'bold',
                      fontSize: $q.screen.lt.sm ? '18px' :
                        ($q.screen.lt.md ? '20px' :
                          ($q.screen.lt.lg ? '22px' : '24px')),
                    }"
                  >
                    Approved Leaves
                  </q-card-section>
                  <q-skeleton v-else :style="{ height: '55px' }" />
                  <template v-if="loading">
                    <div class="q-pa-xs col-12 grid-style-transition">
                      <q-card bordered flat>
                        <template v-for="index in 6" :key="index">
                          <div style="display: flex; justify-content: space-between; width: 100%; padding: 5px 5px 5px;">
                            <q-skeleton :style="{ height: '25px', width: '120px' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'"/>
                            <q-skeleton :style="{ height: '25px', width: '135px' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'"/>
                          </div>
                        </template>
                        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 5px 5px 5px;">
                          <q-skeleton :style="{ height: '25px', width: '120px' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'"/>
                          <div>
                            <q-skeleton :style="{ height: '25px', width: '135px' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'"/>
                            <q-skeleton :style="{ height: '25px', width: '135px' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'"/>
                          </div>
                        </div>
                      </q-card>
                    </div>
                  </template>

                  <template v-else>
                    <q-input
                      v-model="searchTextApproved"
                      placeholder="Search"
                      dense
                      outlined
                      clearable
                      :style="{ width: 'auto', marginLeft: 'auto', 
                        fontSize: $q.screen.lt.sm ? '12px' :
                          ($q.screen.lt.md ? '14px' :
                            ($q.screen.lt.lg ? '16px' : '18px'))
                      }"
                      @clear="clearSearchText"
                    >
                      <template v-slot:append>
                        <q-icon name="search" />
                      </template>
                    </q-input>

                    <q-table
                      v-if="sortedapprovedLeaves.length > 0"
                      grid
                      flat
                      bordered
                      card-class="bg-primary text-white"
                      :rows="sortedapprovedLeaves"
                      :columns="approvedcolumns"
                      row-key="LeaveID"
                      hide-header
                      hide-pagination
                      style="max-height: 450px; overflow-y: auto;"
                      class="virtual-scroll"
                    >
                      <template v-slot:item="props">
                        <div class="q-pa-xs col-12 grid-style-transition">
                          <q-card bordered flat :class="props.selected ? ($q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2') : 'bg-light-gray text-black'">
                            <q-list dense>
                              <q-item v-for="col in props.cols.filter(col => col.name !== 'desc')" :key="col.name">
                                <q-item-section>
                                  <q-item-label>{{ col.label + ':' }}</q-item-label>
                                </q-item-section>
                                <template v-if="col.name === 'Actions/Status'">
                                  <q-item-section side>
                                    <template v-if="props.row.Status === 'Approved'" >
                                      <div class="insideCard">
                                        <q-card style="width: 100%; margin-bottom: 5px">
                                          <q-card-section class="bg-positive text-white text-h6 text-center" style="line-height: 25%;">
                                            Approved
                                          </q-card-section>
                                        </q-card>
                                        <q-card class="bg-positive text-white" style="width: 100%;">
                                          <PDFGen :entry="props.row" />
                                        </q-card>
                                      </div>
                                    </template>
                                  </q-item-section>
                                </template>
                                <template v-else>
                                  <q-item-section side>
                                    <q-item-label caption style="font-weight: bold;">
                                      {{ 
                                        col.field === 'DateFrom' || col.field === 'DateTo'
                                          ? formatDateTime(props.row[col.field])
                                          : col.field === 'LeaveType'
                                          ? LeaveTypeLabels[props.row[col.field]]
                                          : props.row[col.field]
                                      }}
                                    </q-item-label>
                                  </q-item-section>
                                </template>
                              </q-item>
                            </q-list>
                          </q-card>
                        </div>
                      </template>
                    </q-table>
                    <div v-if="sortedapprovedLeaves.length === 0" class="text-center">
                      <q-icon name="warning" style="font-size: 25px"/>
                      No data available
                    </div>
                  </template>
                </template>
              </q-card>

              <!-- Rejected Leaves -->
              <q-card v-show="!showApprovedLeaves" class="rounded">
                <template v-if="$q.screen.width > 900">
                  <q-card-section v-if="!loading" class="bg-negative text-white text-h6 text-center"
                    :style="{
                      fontWeight: 'bold',
                      fontSize: $q.screen.lt.sm ? '16px' : ($q.screen.lt.md ? '18px' : ($q.screen.gt.md && $q.screen.lt.xl ? '20px' : '18px'))
                    }"
                  >
                    <div class="row">
                      <div class="col-4"></div>
                      <div class="col-4 text-center">
                        Rejected Leaves
                      </div>
                      <div class="col-4 text-right">
                        <q-btn-dropdown icon="search" label="search" class="bg-white text-blue" >
                          <q-input class="text-blue" style="font-size: 15px;"
                            v-model="searchTextRejected"
                            placeholder="Search"
                            dense
                            outlined
                            clearable
                            :style="{ width: '250px', marginLeft: 'auto', 
                              fontSize: $q.screen.lt.sm ? '8px' :
                              ($q.screen.lt.md ? '10px' :
                              ($q.screen.lt.lg ? '12px' : '15px'))
                            }"
                            @clear="clearSearchText"
                          />
                        </q-btn-dropdown>
                      </div>
                    </div>
                  </q-card-section>
                  <q-skeleton v-else :style="{ height: '55px' }" />

                  <!-- Q-Skeleton Loading -->
                  <template v-if="loading">
                    <template v-for="rowIndex in 1" :key="rowIndex">
                      <div style="display: flex; justify-content: space-between; align-items: center; height: 50px; background-color: #f2f2ef;">
                        <template v-for="colIndex in 7" :key="colIndex">
                          <div style="flex: 1; display: flex; justify-content: center;">
                            <q-skeleton :style="{ height: '15px', width: '70%' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'" />
                          </div>
                        </template>
                      </div>
                    </template>
                    <template v-for="rowIndex in 3" :key="rowIndex">
                      <div style="display: flex; justify-content: space-between; align-items: center; height: 50px;">
                        <template v-for="colIndex in 7" :key="colIndex">
                          <div style="flex: 1; display: flex; justify-content: center;">
                            <q-skeleton :style="{ height: '35px', width: '85%' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'" />
                          </div>
                        </template>
                      </div>
                    </template>
                  </template>

                  <template v-else>
                    <q-virtual-scroll
                      class="virtual-scroll"
                      type="table"
                      style="max-height: 450px"
                      :virtual-scroll-item-size="48"
                      :virtual-scroll-sticky-size-start="48"
                      :virtual-scroll-sticky-size-end="32"
                      :items="sortedrejectedLeaves"
                    >
                      <template v-slot:before>
                        <thead class="sticky-thead">
                          <tr>
                            <th v-for="col in rejectedcolumns" :key="col.name">
                              {{ col.name }}
                            </th>
                          </tr>
                        </thead>
                      </template>
                      <template v-slot="{ item: row, Name }">
                        <q-tr :key="Name">
                          <template v-if="loading">
                            <q-td v-for="col in rejectedcolumns" :key="col.Name" class="text-center">
                              <q-skeleton :style="{ height: '20px', width: '80%', margin: '10px auto'}"/>
                            </q-td>
                          </template>
                          <template v-else>
                            <q-td v-for="col in rejectedcolumns" :key="col.Name" class="text-center" :style="{ width: col.width || 'auto' }">
                              {{ col.field === 'LeaveType' ? LeaveTypeLabels[row[col.field]] : col.field === 'DateFrom' || col.field === 'DateTo' ? formatDateTime(row[col.field]) : row[col.field] }}
                              <q-item-section  side v-if="col.name === 'Actions/Status'">
                                <template v-if="row.Status === 'Rejected'">
                                  <q-card style="width: 100%; margin-bottom: 5px">
                                    <q-card-section class="bg-negative text-white text-h6 text-center" style="line-height: 25%;">
                                      Rejected
                                    </q-card-section>
                                  </q-card>
                                  <q-card class="bg-positive text-white" style="width: 100%;">
                                    <PDFGen :entry="row" />
                                  </q-card>
                                </template>
                              </q-item-section>
                            </q-td>
                          </template>
                        </q-tr>
                      </template>
                    </q-virtual-scroll> 
                    <div v-if="sortedrejectedLeaves.length === 0" class="text-center">
                      <q-icon name="warning" style="font-size: 30px"/>
                      No data available
                    </div>
                  </template>
                </template>

                <!-- Q-table for Q-Card responsive -->
                <template v-else>
                  <!-- Q-Skeleton Loading -->
                  <q-card-section v-if="!loading" class="bg-negative text-white text-h6 text-center"
                    :style="{
                      fontWeight: 'bold',
                      fontSize: $q.screen.lt.sm ? '18px' :
                        ($q.screen.lt.md ? '20px' :
                          ($q.screen.lt.lg ? '22px' : '24px')),
                    }"
                  > 
                    Rejected Leaves
                  </q-card-section>
                  <q-skeleton v-else :style="{ height: '55px' }" />
                  <template v-if="loading">
                    <div class="q-pa-xs col-12 grid-style-transition">
                      <q-card bordered flat>
                        <template v-for="index in 6" :key="index">
                          <div style="display: flex; justify-content: space-between; width: 100%; padding: 5px 5px 5px;">
                            <q-skeleton :style="{ height: '25px', width: '120px' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'"/>
                            <q-skeleton :style="{ height: '25px', width: '135px' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'"/>
                          </div>
                        </template>
                        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 5px 5px 5px;">
                          <q-skeleton :style="{ height: '25px', width: '120px' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'"/>
                          <div>
                            <q-skeleton :style="{ height: '25px', width: '135px' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'"/>
                            <q-skeleton :style="{ height: '25px', width: '135px' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'"/>
                          </div>
                        </div>
                      </q-card>
                    </div>
                  </template>
                  <template v-else>
                    <q-input
                      v-model="searchTextRejected"
                      placeholder="Search"
                      dense
                      outlined
                      clearable
                      :style="{ width: 'auto', marginLeft: 'auto', 
                        fontSize: $q.screen.lt.sm ? '12px' :
                          ($q.screen.lt.md ? '14px' :
                            ($q.screen.lt.lg ? '16px' : '18px'))
                      }"
                      @clear="clearSearchText"
                    >
                      <template v-slot:append>
                        <q-icon name="search" />
                      </template>
                    </q-input>
                    <q-table
                      v-if="sortedrejectedLeaves.length > 0"
                      grid
                      flat
                      bordered
                      card-class="bg-primary text-white"
                      :rows="sortedrejectedLeaves"
                      :columns="rejectedcolumns"
                      row-key="LeaveID"
                      hide-header
                      hide-pagination
                      style="max-height: 450px; overflow-y: auto;"
                      class="virtual-scroll"
                    >
                      <template v-slot:item="props">
                        <div class="q-pa-xs col-12 grid-style-transition">
                          <q-card
                            bordered
                            flat
                            :class="props.selected ? ($q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2') : 'bg-light-gray text-black'"
                          >                        
                            <q-list dense>
                              <q-item v-for="col in props.cols.filter(col => col.name !== 'desc')" :key="col.name">
                                <q-item-section>
                                  <q-item-label>{{ col.label + ':' }}</q-item-label>
                                </q-item-section>
                                <template v-if="col.name === 'Actions/Status'">
                                  <div class="insideCard">
                                    <template v-if="props.row.Status === 'Rejected'">
                                      <q-card style="width: 100%; margin-bottom: 5px">
                                        <q-card-section class="bg-negative text-white text-h6 text-center" style="line-height: 25%;">
                                          Rejected
                                        </q-card-section>
                                      </q-card>
                                      <q-card class="bg-positive text-white" style="width: 100%;">
                                        <PDFGen :entry="props.row" />
                                      </q-card>
                                    </template>
                                  </div>
                                </template>
                                <template v-else>
                                  <q-item-section side>
                                    <q-item-label caption style="font-weight: bold;">
                                      {{ 
                                        col.field === 'DateFrom' || col.field === 'DateTo'
                                          ? formatDateTime(props.row[col.field])
                                          : col.field === 'LeaveType'
                                          ? LeaveTypeLabels[props.row[col.field]]
                                          : props.row[col.field]
                                      }}
                                    </q-item-label>
                                  </q-item-section>
                                </template>
                              </q-item>
                            </q-list>
                          </q-card>
                        </div>
                      </template>
                    </q-table>
                    <div v-if="sortedrejectedLeaves.length === 0" class="text-center">
                      <q-icon name="warning" style="font-size: 25px"/>
                      No data available
                    </div>
                  </template>
                </template>
              </q-card>
            </div>
          </div>
        </div>
      </q-page-container>
    </q-page>
  </q-layout>
</template>



<script>
import { QSpinnerTail } from 'quasar';
import { delay } from '../helpers/util.js'
import PDFGen from '../components/GeneratePDF.vue'

export default {


  data() {
    return {
      searchTextPending: '',
      searchTextApproved: '',
      searchTextRejected: '',
      loadingCounter: null,
      loading: true,
      showApprovedLeaves: true,
      leaveAction: false,
      skeletonAnimations: [
        'wave', 'fade', 'fade', 'none'
      ],
      LeaveTypes: [
        { label: 'Vacation Leave', value: 'VL' },
        { label: 'Sick Leave', value: 'SL' },
        { label: 'Emergency Leave', value: 'EL' },
      ],

      approvedLeaves: [],
      approvedcolumns: [
        { name: 'Employee Name', label: 'Employee Name', align: 'center', field: 'EmployeeName', sortable: false, width: '220px'},  
        { name: 'Leave ID', label: 'Leave ID', align: 'center', field: 'LeaveID', sortable: false, width: '100px' },            
        { name: 'Days', label: 'Days', align: 'center', field: 'Days', sortable: false, width: '100px' },
        { name: 'DateFrom', label: 'Date From', align: 'center', field: 'DateFrom', sortable: false, width: '140px' },
        { name: 'DateTo', label: 'Date To', align: 'center', field: 'DateTo', sortable: false, width: '140px' },
        { name: 'LeaveType', label: 'Leave Type', align: 'center', field: 'LeaveType', sortable: false, width: '150px' },
        { name: 'Actions/Status', label: 'Actions', align: 'center', field: 'id', sortable: false, width: '150px' },
      ],

      rejectedLeaves: [],
      rejectedcolumns: [
        { name: 'Employee Name', label: 'Employee Name', align: 'center', field: 'EmployeeName', sortable: false, width: '220px' }, 
        { name: 'Leave ID', label: 'Leave ID', align: 'center', field: 'LeaveID', sortable: false, width: '100px' },             
        { name: 'Days', label: 'Days', align: 'center', field: 'Days', sortable: false, width: '100px' },
        { name: 'DateFrom', label: 'Date From', align: 'center', field: 'DateFrom', sortable: false, width: '140px' },
        { name: 'DateTo', label: 'Date To', align: 'center', field: 'DateTo', sortable: false, width: '140px' },
        { name: 'LeaveType', label: 'Leave Type', align: 'center', field: 'LeaveType', sortable: false, width: '150px' },
        { name: 'Actions/Status', label: 'Actions', align: 'center', field: 'id', sortable: false, width: '150px' },
      ],

      pendingLeave: [],
      pendingcolumns: [
        { name: 'Employee Name', label: 'Employee Name', align: 'center', field: 'EmployeeName', sortable: false, width: '220px' },  
        { name: 'Leave ID', label: 'Leave ID', align: 'center', field: 'LeaveID', sortable: false, width: '100px' },      
        { name: 'Days', label: 'Days', align: 'center', field: 'Days', sortable: false, width: '100px' },
        { name: 'DateFrom', label: 'Date From', align: 'left', field: 'DateFrom', sortable: false, width: '140px' },
        { name: 'DateTo', label: 'Date To', align: 'left', field: 'DateTo', sortable: false, width: '140px' },
        { name: 'LeaveType', label: 'Leave Type', align: 'left', field: 'LeaveType', sortable: false, width: '150px' },
        { name: 'Actions', label: 'Actions', align: 'center', sortable: false, width: '150px' },
      ],

      leaveBalance: [],
      balancecolumns: [
        { name: 'Year', label: 'Year', align: 'center', field: 'Year', sortable: false},
        { name: 'LeaveType', label: 'Leave Type', align: 'center', field: 'LeaveType', format: (val) => this.LeaveTypeLabels[val], sortable: false},
        { name: 'Balance', label: 'Balance', align: 'center', field: 'Balance', sortable: false},
      ],

      AllLeaveBalance: [],

    };
  },

  components: {
    PDFGen,
  },

  computed: {


    sortedPendingLeave() {
      return this.pendingLeave
        .map(item => ({
          ...item,
          EmployeeName: `${item.LastName}, ${item.FirstName} ${item.MiddleInitial + '.'}`,
        }))
        .filter(row => {
          const query = this.searchTextPending.toLowerCase();
          return (
            row.EmployeeName.toLowerCase().includes(query) ||
            row.LeaveID.toString().toLowerCase().includes(query) ||
            this.LeaveTypeLabels[row.LeaveType].toLowerCase().includes(query)
          );
        })
        .sort((a, b) => b.LeaveID - a.LeaveID);
    },

    sortedapprovedLeaves() {
      return this.approvedLeaves
      .map(item => ({
          ...item,
          EmployeeName: `${item.LastName}, ${item.FirstName} ${item.MiddleInitial}`,
        }))
        .filter(row => {
          const query = this.searchTextApproved.toLowerCase();
          return (
            row.EmployeeName.toLowerCase().includes(query) ||
            row.LeaveID.toString().toLowerCase().includes(query) ||
            this.LeaveTypeLabels[row.LeaveType].toLowerCase().includes(query)
          );
        })
        .sort((a, b) => b.LeaveID - a.LeaveID);
    },

    sortedrejectedLeaves() {
      return this.rejectedLeaves
      .map(item => ({
          ...item,
          EmployeeName: `${item.LastName}, ${item.FirstName} ${item.MiddleInitial}`,
        }))
        .filter(row => {
          const query = this.searchTextRejected.toLowerCase();
          return (
            row.EmployeeName.toLowerCase().includes(query) ||
            row.LeaveID.toString().toLowerCase().includes(query) ||
            this.LeaveTypeLabels[row.LeaveType].toLowerCase().includes(query)
          );
        })
        .sort((a, b) => b.LeaveID - a.LeaveID);
    },


    LeaveTypeLabels() {
      return this.LeaveTypes.reduce((acc, LeaveType) => {
        acc[LeaveType.value] = LeaveType.label;
        return acc;
      }, {});
    },

  },

  methods: {

    clearSearchText() {
      this.searchTextPending = '';
      this.searchTextApproved = '';
      this.searchTextRejected = '';
    },

    toggleLeavesTable() {
      this.showApprovedLeaves = !this.showApprovedLeaves;
    },

    formatDateTime(dateTimeString) {
      const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      };
      const dateTime = new Date(dateTimeString);
      return dateTime.toLocaleDateString(undefined, options);
    },

    async fetchpendingLeaves() {
      await delay(2000);
      try {
        await this.$store.dispatch('leaveModule/fetchpendingLeaves');
        this.pendingLeave = this.$store.state.leaveModule.pendingDetails;

        this.loadingCounter++;
        if(this.loadingCounter === 3) {
          this.loading = false;
        }
      } catch (error) {
        console.error('Failed to get pending leaves / Admin Only');
      } 
    },

    async fetchapprovedLeaves() {
      try {
        await this.$store.dispatch('leaveModule/fetchapprovedLeaves');
        this.approvedLeaves = this.$store.state.leaveModule.approvedDetails;

        this.loadingCounter++;
        if(this.loadingCounter === 3) {
          this.loading = false;
        }
      } catch (error) {
        console.error('Failed to get Approved leaves / Admin Only');
      }
    },

    async fetchrejectedLeaves() {
      try {
        await this.$store.dispatch('leaveModule/fetchrejectedLeaves');
        this.rejectedLeaves = this.$store.state.leaveModule.rejectedDetails;

        this.loadingCounter++;
        if(this.loadingCounter === 3) {
          this.loading = false;
        }

      } catch (error) {
        console.error('Failed to get Rejected leaves / Admin Only');
      }
    },

    async fetchAllLeaveBalances() {
      try {
        await this.$store.dispatch('leaveModule/fetchAllLeaveBalances');
        this.AllLeaveBalance = this.$store.state.leaveModule.AllBalanceDetails;
      } catch (error) {
        console.error('Failed to get All User Leave Balance');
      }
    },

    async approveLeave(LeaveID) {
      this.$q.loading.show({
          spinner: QSpinnerTail,
          message: 'Approving Leave Request',
          messageColor: 'white',
          backgroundColor: 'gray',
          spinnerColor: 'blue',
          customClass: 'custom-loading-style',
        });

      try {
        await this.$store.dispatch('leaveModule/approveLeaves', LeaveID);
        this.fetchpendingLeaves();
        this.fetchapprovedLeaves();
        await delay(1500);
        this.$q.loading.hide();
        this.$q.notify({
          color: 'positive',
          position: 'center',
          message: 'Success Approving Leave Reqeust',
          icon: 'check',
          iconColor: 'white',
          timeout: 1000,
          progress: true,
        });

      } catch (error) {
        console.error('Failed Approving The Leave');
        this.$q.notify({
          color: 'negative',        
          position: 'center',
          message: 'Failed Approving Leave',
          icon: 'report_problem',  
          iconColor: 'white',
          timeout: 1000,
          progress: true,
        });
      }
    },

    async rejectLeave(LeaveID) {
      this.$q.loading.show({
          spinner: QSpinnerTail,
          message: 'Rejecting Leave Request',
          messageColor: 'white',
          backgroundColor: 'gray',
          spinnerColor: 'blue',
          customClass: 'custom-loading-style',
        });

      try {
        await this.$store.dispatch('leaveModule/rejectLeaves', LeaveID);
        this.fetchpendingLeaves();
        this.fetchrejectedLeaves();
        await delay(1500);
        this.$q.loading.hide();
        this.$q.notify({
          color: 'positive',
          position: 'center',
          message: 'Success Rejecting Leave Request',
          icon: 'check', 
          iconColor: 'white',
          timeout: 1000,
          progress: true, 
        });

      } catch (error) {
        console.error('Error Rejecting Leave Request');
        this.$q.notify({
          color: 'negative',        
          position: 'center',
          message: 'Failed Rejecting Leave',
          icon: 'report_problem',  
          iconColor: 'white',
          timeout: 1000,
          progress: true,
        });
      }
    },

  },

  created() {
    this.fetchpendingLeaves();
    this.fetchapprovedLeaves();
    this.fetchrejectedLeaves();
    this.fetchAllLeaveBalances()

  },
};

</script>


<style>

.rounded {
  border-radius: 10px;
  margin-top: 10px;
  padding-bottom: 10px;
}

.roundedd1 {
  border-radius: 10px;
  margin-top: 10px;
  margin-bottom: 50px;
  padding-bottom: 10px;
}


.containermainn {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}


.custom-loading-style {
  font-weight: bold;
  font-size: 20px;
}






</style>