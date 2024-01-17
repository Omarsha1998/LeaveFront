<template>
  <div>
    <q-layout>
      <q-page-container>
        <div class="containermainn">
          <div class="row" style="width: 90%;">

            <!-- Leave Request Form -->
            <div :class="$q.screen.gt.md ? 'col-4 q-pr-lg' : 'col-12'">
              <div>
                <q-card class="roundedd">
                  <q-card-section v-if="!loading" class="bg-primary text-white text-h6 text-center"
                    :style="{
                      fontWeight: 'bold',
                      fontSize: $q.screen.lt.sm ? '18px' : ($q.screen.lt.md ? '20px' : ($q.screen.lt.lg ? '22px' : '24px'))
                    }"
                  >
                    Leave Request Form
                  </q-card-section>

                  <q-skeleton v-else :style="{ height: '55px' }" />

                  <q-card-section v-if="!loading">
                    <q-input filled label="Days" v-model="Days" type="number" min="0.5" step="0.5" @input="updateDateTo" style="margin-bottom: 5px;" />
                    <q-input filled v-model="DateFrom" label="Date From" @change="updateDateTo" @click="showPopup('dateFromPopup')" style="margin-bottom: 5px;">
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy ref="dateFromPopup" :breakpoint="1440" cover>
                            <q-date v-model="DateFrom" mask="MM/DD/YYYY" ></q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                    <q-input filled v-model="DateTo" label="Date To" @change="updateDays" @click="showPopup('dateToPopup')" style="margin-bottom: 5px;">
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy ref="dateToPopup" :breakpoint="1440" cover>
                            <q-date v-model="DateTo" mask="MM/DD/YYYY"></q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                    <q-input filled label="Time From" v-model="TimeFrom" @click="showPopup('TimeFromPopup')" style="margin-bottom: 5px;">
                      <template v-slot:append>
                        <q-icon name="schedule" class="cursor-pointer">
                          <q-popup-proxy ref="TimeFromPopup" :breakpoint="1440" cover>
                            <q-time v-model="TimeFrom" mask="h:mm A"></q-time>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                    <q-input filled label="Time To" v-model="TimeTo" @click="showPopup('TimeToPopup')" style="margin-bottom: 5px;">
                      <template v-slot:append>
                        <q-icon name="schedule" class="cursor-pointer">
                          <q-popup-proxy ref="TimeToPopup" :breakpoint="1440" cover>
                            <q-time v-model="TimeTo" mask="h:mm A"></q-time>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                    <q-select v-model="LeaveType" label="Leave Type" filled dense required :options="LeaveTypes" style="margin-bottom: 5px; " />
                    <q-input filled v-model="Reason" label="Reason for Leave" style="margin-bottom: 20px;" />
                    <div class="text-center">
                      <q-btn push color="blue" text-color="white" label="Submit Application" @click="submitLeaveRequest" />
                    </div>
                  </q-card-section>

                  <!-- Q-Skeleton Loading -->
                  <q-card-section v-else>
                    <template v-for="index in 7" :key="index">
                      <q-skeleton :style="{ height: '50px', marginBottom: '10px' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'" />
                    </template>
                    <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }" >
                      <q-skeleton :style="{ height: '35px', width: '170px' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'" />
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>

            
            <!-- Leave Details / Leave Balance -->
            <div :class="$q.screen.gt.md ? 'col-8' : 'col-12'">
              <q-card class="roundedd">
                <template v-if="$q.screen.width > 900">
                  <q-card-section v-if="!loading" class="bg-primary text-white text-h6"
                    :style="{
                      fontWeight: 'bold',
                      fontSize: $q.screen.lt.sm ? '18px' : ($q.screen.lt.md ? '20px' : ($q.screen.lt.lg ? '22px' : '24px')),
                    }"
                  > 
                    <div class="row">
                      <div class="col-4"></div>
                      <div class="col-4 text-center">
                        Leave Details
                      </div>
                      <div class="col-4 text-right">
                        <q-btn-dropdown icon="search" label="search" class="bg-white text-blue">
                          <q-input class="text-blue" style="font-size: 15px;"
                            v-model="searchTextBalance"
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

                  <template v-if="loading">
                    <!-- Q-Skeleton Loading -->
                    <template v-for="rowIndex in 1" :key="rowIndex">
                      <div style="display: flex; justify-content: space-between; align-items: center; height: 50px; background-color: #f2f2ef;">
                        <template v-for="colIndex in 3" :key="colIndex">
                          <div style="flex: 1; display: flex; justify-content: center;">
                            <q-skeleton :style="{ height: '15px', width: '70%' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'"/>
                          </div>
                        </template>
                      </div>
                    </template>
                    <template v-for="rowIndex in 7" :key="rowIndex">
                      <div style="display: flex; justify-content: space-between; align-items: center; height: 60px;">
                        <template v-for="colIndex in 3" :key="colIndex">
                          <div style="flex: 1; display: flex; justify-content: center;">
                            <q-skeleton :style="{ height: '50px', width: '85%' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'" />
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
                      :items="sortedLeaveBalance"
                    >
                      <template v-slot:before>
                        <thead class="sticky-thead">
                          <tr>
                            <th
                              v-for="col in balancecolumns"
                              :key="col.name"
                              :style="{ width: 'calc(100% / ' + balancecolumns.length + ')'}"
                              class="text-center"
                            >
                              {{ col.name }}
                            </th>
                          </tr>
                        </thead>
                      </template>

                      <template v-slot="{ item: row, Year }">
                        <q-tr :key="Year">
                          <q-td v-for="col in balancecolumns" :key="col.Year" class="text-center" :style="{ width: col.width || 'auto' }">
                            {{ col.field === 'leaveType' ? LeaveTypeLabels[row[col.field]] : row[col.field] }}
                          </q-td>
                        </q-tr>
                      </template>
                    </q-virtual-scroll>
                    <div v-if="sortedLeaveBalance.length === 0" class="text-center">
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
                    Leave Details
                  </q-card-section>
                  <q-skeleton v-else :style="{ height: '55px' }" />

                  <template v-if="loading">
                    <div class="q-pa-xs col-12 grid-style-transition">
                      <q-card bordered flat>
                        <template v-for="index in 14" :key="index">
                          <div style="display: flex; justify-content: space-between; width: 100%; padding: 5px 5px 5px;">
                            <q-skeleton :style="{ height: '25px', width: '120px' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'"/>
                            <q-skeleton :style="{ height: '25px', width: '130px' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'"/>
                          </div>
                        </template>
                      </q-card>
                    </div>
                  </template>

                  <template v-else>
                    <q-input
                      v-model="searchTextBalance"
                      placeholder="Search"
                      dense
                      outlined
                      clearable
                      :style="{ width: 'auto', 
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
                      v-if="sortedLeaveBalance.length > 0"
                      grid
                      flat
                      bordered
                      card-class="bg-primary text-white"
                      :rows="sortedLeaveBalance"
                      :columns="balancecolumns"
                      row-key="LeaveID"
                      hide-header
                      hide-bottom
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
                                <q-item-label caption style="padding-top: 7px; font-weight: bold;">
                                  {{ 
                                    col.field === 'leaveType'
                                      ? LeaveTypeLabels[props.row[col.field]]
                                      : props.row[col.field]
                                  }}
                                </q-item-label>
                              </q-item>
                            </q-list>
                          </q-card>
                        </div>
                      </template>
                    </q-table>
                    <div v-if="sortedLeaveBalance.length === 0" class="text-center">
                      <q-icon name="warning" style="font-size: 25px;" />
                        No data available
                    </div>
                  </template>
                </template>
              </q-card>
            </div>


            <!-- Toggle for Leave History and Forfeited Leave -->
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
                  :label="showLeaveHistory ? 'Show Forfeited Leaves' : 'Show Leave History'"
                  color="primary"
                />
              </div>
            </div>


            <!-- Leave History -->
            <div class="col-12">
              <q-card v-show="showLeaveHistory" class="roundedd1">
                <template v-if="$q.screen.width > 900">
                  <q-card-section v-if="!loading" class="bg-primary text-white text-h6 text-center"
                    :style="{
                      fontWeight: 'bold',
                      fontSize: $q.screen.lt.sm ? '18px' :
                        ($q.screen.lt.md ? '20px' :
                        ($q.screen.lt.lg ? '22px' : '24px'))
                    }"
                  >
                    <div class="row">
                      <div class="col-4"></div>
                      <div class="col-4 text-center">
                        Leave History
                      </div>
                      <div class="col-4 text-right">
                        <q-btn-dropdown icon="search" label="search" class="bg-white text-blue">
                          <q-input class="text-blue" style="font-size: 15px;"
                            v-model="searchTextDetails"
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

                  <template v-if="loading">
                    <!-- Q-Skeleton Loading -->
                    <template v-for="rowIndex in 1" :key="rowIndex">
                      <div style="display: flex; justify-content: space-between; align-items: center; height: 50px; background-color: #f2f2ef;">
                        <template v-for="colIndex in 8" :key="colIndex">
                          <div style="flex: 1; display: flex; justify-content: center;">
                            <q-skeleton :style="{ height: '15px', width: '70%' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'" />
                          </div>
                        </template>
                      </div>
                    </template>
                    <template v-for="rowIndex in 7" :key="rowIndex">
                      <div style="display: flex; justify-content: space-between; align-items: center; height: 50px;">
                        <template v-for="colIndex in 8" :key="colIndex">
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
                      :items="sortedLeaveDetails"
                    >
                      <template v-slot:before>
                        <thead class="sticky-thead">
                          <tr>
                            <th v-for="col in leavecolumns" :key="col.name">
                              {{ col.name }}
                            </th>
                          </tr>
                        </thead>
                      </template>

                      <template v-slot="{ item: row, LeaveID }">
                        <q-tr :key="LeaveID">
                          <q-td v-for="col in leavecolumns" :key="col.LeaveID" class="text-center" :style="{ width: col.width || 'auto' }">
                            {{ col.field === 'LeaveType' ? LeaveTypeLabels[row[col.field]] : col.field === 'DateFrom' || col.field === 'DateTo' ? formatDateTime(row[col.field]) : row[col.field] }}
                            <template v-if="col.name === 'Actions/Status'">
                              <template v-if="row.Status === 'Rejected'">
                                <q-card style="width: 100%;">
                                  <q-card-section class="bg-negative text-white text-h6 text-center" style="line-height: 25%;">
                                    Rejected
                                  </q-card-section>
                                </q-card>
                              </template>
                              <template v-else-if="row.Status === 'Approved'">
                                <q-card style="width: 100%;">
                                  <q-card-section class="bg-positive text-white text-h6 text-center" style="line-height: 25%;">
                                    Approved
                                  </q-card-section>
                                </q-card>
                              </template>
                              <template v-else>
                                <div style="display: flex; justify-content: space-between; width: 100%; margin-bottom: 5px;">
                                  <q-btn
                                    @click="editLeave(row.LeaveID)"
                                    icon="edit"
                                    color="primary"
                                    style="width: 45%"
                                  />
                                  <q-btn
                                    @click="deleteLeave(row.LeaveID)"
                                    icon="delete"
                                    color="negative"
                                    style="width: 45%"
                                  />
                                </div>
                                <div class="bg-positive text-white" style="width: 100%;">
                                  <!-- <q-btn @click="generatePDFForEntry(row)" 
                                    label="Print PDF" 
                                    color="primary" 
                                    style="line-height: 50%; width: 100%;">
                                    <q-icon class="pdf-icon" name="picture_as_pdf" size="20px" />
                                  </q-btn> -->
                                  <PDFGen :entry="row" />
                                </div>
                              </template>
                            </template>
                          </q-td>
                        </q-tr>
                      </template>
                    </q-virtual-scroll>
                    <div v-if="sortedLeaveDetails.length === 0" class="text-center">
                      <q-icon name="warning" style="font-size: 30px"/>
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
                    Leave History
                  </q-card-section>
                  <q-skeleton v-else :style="{ height: '55px' }" />

                  <template v-if="loading">
                    <div class="q-pa-xs col-12 grid-style-transition">
                      <q-card bordered flat>
                        <template v-for="index in 7" :key="index">
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
                      v-model="searchTextDetails"
                      placeholder="Search"
                      dense
                      outlined
                      clearable
                      :style="{ width: 'auto',
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
                      v-if="sortedLeaveDetails.length > 0"
                      grid
                      flat
                      bordered
                      card-class="bg-primary text-white"
                      :rows="sortedLeaveDetails"
                      :columns="leavecolumns"
                      row-key="LeaveID"
                      hide-bottom
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
                                    <template v-if="props.row.Status === 'Approved'">
                                      <q-card bordered flat class="bg-green text-white">
                                        <q-card-section class="text-h6 text-center" style="line-height: 15%;">
                                          Approved
                                        </q-card-section>
                                      </q-card>
                                    </template>
                                    <template v-else-if="props.row.Status === 'Rejected'">
                                      <q-card bordered flat class="bg-red text-white">
                                        <q-card-section class="bg-negative text-white text-h6 text-center" style="line-height: 15%;">
                                          Rejected
                                        </q-card-section>
                                      </q-card>
                                    </template>
                                    <template v-else>
                                      <div style="display: flex; justify-content: space-between; width: 100%;">
                                        <q-btn
                                          @click="editLeave(props.row.LeaveID)"
                                          icon="edit"
                                          color="primary"
                                          style="width: 45%"
                                        />
                                        <q-btn
                                          @click="deleteLeave(props.row.LeaveID)"
                                          icon="delete"
                                          color="negative"
                                          style="width: 45%"
                                        />
                                      </div>
                                      <div class="bg-positive text-white" style="width: 100%; margin-top: 5px;">
                                        <!-- <q-btn @click="generatePDFForEntry(props.row)" label="Print PDF" color="primary" style="line-height: 50%; width: 100%">
                                          <q-icon class="pdf-icon" name="picture_as_pdf" size="20px" />
                                        </q-btn> -->
                                        <PDFGen :entry="props.row"></PDFGen>
                                      </div>
                                    </template>
                                  </div>
                                </template>
                                <template v-else>
                                  <q-item-label caption style="padding-top: 7px; font-weight: bold;">
                                    {{ 
                                      col.field === 'DateFrom' || col.field === 'DateTo'
                                        ? formatDateTime(props.row[col.field])
                                        : col.field === 'LeaveType'
                                        ? LeaveTypeLabels[props.row[col.field]]
                                        : props.row[col.field]
                                    }}
                                  </q-item-label>
                                </template>
                              </q-item>
                            </q-list>
                          </q-card>
                        </div>
                      </template>
                    </q-table>
                    <div v-if="sortedLeaveDetails.length === 0" class="text-center">
                      <q-icon name="warning" style="font-size: 25px" />
                      No data available
                    </div>
                  </template>
                </template>
              </q-card>
            </div>


            <!-- Forfeited Leaves -->
            <div class="col-12">
              <q-card v-show="!showLeaveHistory" class="roundedd1">
                <template v-if="$q.screen.width > 900">
                  <q-card-section v-if="!loading" class="bg-primary text-white text-h6 text-center"
                    :style="{
                      fontWeight: 'bold',
                      fontSize: $q.screen.lt.sm ? '18px' :
                        ($q.screen.lt.md ? '20px' :
                        ($q.screen.lt.lg ? '22px' : '24px'))
                    }"
                  >
                    <div class="row">
                      <div class="col-4"></div>
                      <div class="col-4 text-center">
                        Forfeited Leaves
                      </div>
                      <div class="col-4 text-right">
                        <q-btn-dropdown icon="search" label="search" class="bg-white text-blue" >
                          <q-input class="text-blue" style="font-size: 15px;"
                            v-model="searchTextForfeited"
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

                  <template v-if="loading">
                    <!-- Q-Skeleton Loading -->
                    <template v-for="rowIndex in 1" :key="rowIndex">
                      <div style="display: flex; justify-content: space-between; align-items: center; height: 50px; background-color: #f2f2ef;">
                        <template v-for="colIndex in 8" :key="colIndex">
                          <div style="flex: 1; display: flex; justify-content: center;">
                            <q-skeleton :style="{ height: '15px', width: '70%' }" :animation="skeletonAnimations.includes('fade') ? 'fade' : 'none'" />
                          </div>
                        </template>
                      </div>
                    </template>
                    <template v-for="rowIndex in 7" :key="rowIndex">
                      <div style="display: flex; justify-content: space-between; align-items: center; height: 50px;">
                        <template v-for="colIndex in 8" :key="colIndex">
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
                      :items="sortedForfeitedLeaves"
                    >
                      <template v-slot:before>
                        <thead class="sticky-thead">
                          <tr>
                            <th v-for="col in forfeitedColumns" :key="col.name">
                              {{ col.name }}
                            </th>
                          </tr>
                        </thead>
                      </template>

                      <template v-slot="{ item: row, LeaveID }">
                        <q-tr :key="LeaveID">
                          <q-td v-for="col in forfeitedColumns" :key="col.id" class="text-center" :style="{ width: col.width || 'auto' }">
                            {{ col.field === 'leaveType' ? LeaveTypeLabels[row[col.field]] : col.field === 'transDate' ? formatDateTime(row[col.field]) : row[col.field] }}
                          </q-td>
                        </q-tr>
                      </template>
                    </q-virtual-scroll>
                    <div v-if="sortedForfeitedLeaves.length === 0" class="text-center">
                      <q-icon name="warning" style="font-size: 30px"/>
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
                    Forfeited Leaves
                  </q-card-section>
                  <q-skeleton v-else :style="{ height: '55px' }" />
                  <template v-if="loading">
                    <div class="q-pa-xs col-12 grid-style-transition">
                      <q-card bordered flat>
                        <template v-for="index in 7" :key="index">
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
                      v-model="searchTextForfeited"
                      placeholder="Search"
                      dense
                      outlined
                      clearable
                      :style="{ width: 'auto', 
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
                      v-if="sortedForfeitedLeaves.length > 0"
                      grid
                      flat
                      bordered
                      card-class="bg-primary text-white"
                      :rows="sortedForfeitedLeaves"
                      :columns="forfeitedColumns"
                      row-key="id"
                      hide-bottom
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
                                <q-item-label caption style="padding-top: 7px; font-weight: bold;">
                                  {{ 
                                    col.field === 'transDate'
                                      ? formatDateTime(props.row[col.field])
                                      : col.field === 'leaveType'
                                      ? LeaveTypeLabels[props.row[col.field]]
                                      : props.row[col.field]
                                  }}
                                </q-item-label>
                              </q-item>
                            </q-list>
                          </q-card>
                        </div>
                      </template>
                    </q-table>
                    <div v-if="sortedForfeitedLeaves.length === 0" class="text-center">
                      <q-icon name="warning" style="font-size: 25px"/>
                      No data available
                    </div>
                  </template>
                </template>
              </q-card>
            </div>
          </div>
        </div>

        <!-- Edit / Delete Dialog -->
        <q-dialog v-model="editDialog" @hide="resetForm">
          <q-card :style="{ 
              'min-width': $q.screen.lt.sm ? '250px' : $q.screen.lt.md ? '350px' : '450px',
              'min-height': $q.screen.lt.sm ? '200px' : $q.screen.lt.md ? '300px' : '400px'
            }"
            class="rounded"
          >           
            <q-card-section rd-section class="bg-primary text-white text-h6 text-center"
              :style="{
                fontWeight: 'bold',
                fontSize: $q.screen.lt.sm ? '14px' : ($q.screen.gt.sm ? '18px' : ($q.screen.gt.md ? '20px' : ($q.screen.gte.lg ? '24px' : '28px')))
              }"
            >
              Edit Leave Form
            </q-card-section>
            <q-card-section>
              <q-input filled label="Days" v-model="Days2" type="number" min="0.5" step="0.5" @input="updateDateTo" />
              <q-input filled v-model="DateFrom2" label="Date From" @change="updateDateTo" @click="showPopup('dateFromPopup2')" style="margin-bottom: 5px;">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="dateFromPopup2" :breakpoint="1440" cover>
                      <q-date v-model="DateFrom2" mask="MM/DD/YYYY" ></q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-input filled v-model="DateTo2" label="Date To" @change="updateDays" @click="showPopup('dateToPopup2')" style="margin-bottom: 5px;">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="dateToPopup2" :breakpoint="1440" cover>
                      <q-date v-model="DateTo2" mask="MM/DD/YYYY"></q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-input filled label="Time From" v-model="TimeFrom2" @click="showPopup('TimeFromPopup2')" style="margin-bottom: 5px;">
                <template v-slot:append>
                  <q-icon name="schedule" class="cursor-pointer">
                    <q-popup-proxy ref="TimeFromPopup2" :breakpoint="1440" cover>
                      <q-time v-model="TimeFrom2" mask="h:mm A"></q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-input filled label="Time To" v-model="TimeTo2" @click="showPopup('TimeToPopup2')" style="margin-bottom: 5px;">
                <template v-slot:append>
                  <q-icon name="schedule" class="cursor-pointer">
                    <q-popup-proxy ref="TimeToPopup2" :breakpoint="1440" cover>
                      <q-time v-model="TimeTo2" mask="h:mm A"></q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-select v-model="LeaveType2" label="Leave Type" filled dense required :options="LeaveTypes" />
              <q-input filled v-model="Reason2" label="Reason for Leave"></q-input>
              <br />
              <div style="display: flex; justify-content: center; gap: 10px;">
                <q-btn color="primary" class="q-mr-xs" @click="updateLeave" label="Submit" />
                <q-btn color="red" class="q-ml-xs" @click="cancelEdit" label="Cancel" />
              </div>
            </q-card-section>
          </q-card>
        </q-dialog>
      </q-page-container>
    </q-layout>
  </div>
</template>







<script>
import { QSpinnerTail } from 'quasar';
import { delay } from '../helpers/util.js'
import PDFGen from '../components/GeneratePDF.vue'

export default {
  data() {
    return {
      searchTextDetails: '',
      searchTextForfeited: '',
      searchTextBalance: '',
      skeletonAnimations: [
        'wave', 'fade', 'fade', 'none'
      ],
      showLeaveHistory: true,
      loadingCounter: null,
      loading: true,
      updateDateToTriggered: false,
      Days: null,
      TimeFrom: null,
      TimeTo: null,
      DateFrom: null,
      DateTo: null,
      LeaveType: null,
      Reason: null,
      Days2: null,
      TimeFrom2: null,
      TimeTo2: null,
      DateFrom2: null,
      DateTo2: null,
      LeaveType2: null,
      Reason2: null,
      LeaveTypes: [
        { label: 'Vacation Leave', value: 'VL' },
        { label: 'Sick Leave', value: 'SL' },
        { label: 'Emergency Leave', value: 'EL' },
        { label: 'Birthday Leave', value: 'BL' },
        { label: 'Leave Without Pay', value: 'LWOP' },
        { label: 'Magna Carta', value: 'MGL' },
        { label: 'Maternity Leave', value: 'ML' },
        { label: 'Official Leave', value: 'OL' },
        { label: 'Parental Leave', value: 'PRL' },
        { label: 'Paternity Leave', value: 'PL' },
        { label: 'Sabbatical Leave', value: 'SBL' },
        { label: 'Study Leave', value: 'STL' },
        { label: 'Union Leave', value: 'UL' },
      ],
      LeaveDetails: [],
      leavecolumns: [
        { name: 'LeaveID', label: 'LeaveID', align: 'center', field: 'LeaveID', width: '140px' },
        { name: 'Days', label: 'Days', align: 'center', field: 'Days', sortable: false, width: '85px' },
        { name: 'Time From', label: 'Time From', align: 'center', field: 'TimeFrom', sortable: false, width: '135px' },
        { name: 'Time To', label: 'Time To', align: 'center', field: 'TimeTo', sortable: false, width: '135px' },
        { name: 'Date From', label: 'Date From', align: 'center', field: 'DateFrom', sortable: false, width: '135px' },
        { name: 'Date To', label: 'Date To', align: 'center', field: 'DateTo', sortable: false, width: '135px' },
        { name: 'Leave Type', label: 'Leave Type', align: 'center', field: 'LeaveType', sortable: false, width: '145px' },
        { name: 'Actions/Status', label: 'Actions/Status', align: 'center', field: 'Actions/Status', sortable: false, width: '90px' },
      ],
      editDialog: false,
      editLeaveID: null,
      leaveBalance: [],
      balancecolumns: [
        { name: 'Leave Type', label: 'Leave Type', align: 'center', field: 'leaveType', sortable: false },
        { name: 'Year Attributed', label: 'Year', align: 'center', field: 'Year', sortable: false },
        { name: 'Balance', label: 'Balance', align: 'center', field: 'Remaining', sortable: false } ,
      ],
      AllLeaveBalance: [],
      ForfeitedLeaves: [],
      forfeitedColumns: [
        { name: 'ID', label: 'ID', align: 'center', field: 'id', sortable: false},
        { name: 'Remarks', label: 'Remarks', align: 'center', field: 'remarks', sortable: false},
        { name: 'Leave Type', label: 'Leave Type', align: 'center', field: 'leaveType', sortable: false},
        { name: 'Value / Days', label: 'Value / Days', align: 'center', field: 'credit', sortable: false},
        { name: 'Year Effectivity', label: 'Year Effectivity', align: 'center', field: 'yearEffectivity', sortable: false},
        { name: 'Year Attributed', label: 'Year Attributed', align: 'center', field: 'yearAttributed', sortable: false},
        { name: 'Transaction Date', label: 'Transaction Date', align: 'center', field: 'transDate', sortable: false},
      ],
      
    };
  },

  components: {
    PDFGen,
  },

  computed: {

    sortedLeaveBalance() {
      if (Array.isArray(this.leaveBalance)) {
        const query = this.searchTextBalance.toLowerCase();

        return this.leaveBalance
          .filter((row) => {
            return (
              row.Year.toString().toLowerCase().includes(query) ||
              this.LeaveTypeLabels[row.leaveType].toLowerCase().includes(query)
            );
          })
          .sort((a, b) => {
          const leaveTypeComparison = a.leaveType.localeCompare(b.leaveType);
          if (leaveTypeComparison !== 0) {
            return leaveTypeComparison;
          }

          return b.Year - a.Year;
        });
      } else {
        return [];
      }
    },

    sortedLeaveDetails() {
      if (Array.isArray(this.LeaveDetails)) {
        const query = this.searchTextDetails.toLowerCase();

        return this.LeaveDetails
          .filter((row) => {
            return (
              row.LeaveID.toString().toLowerCase().includes(query) || 
              this.LeaveTypeLabels[row.LeaveType].toLowerCase().includes(query)
            );
          })
          .sort((a, b) => b.LeaveID - a.LeaveID);
      } else {
        return [];
      }
    },

    sortedForfeitedLeaves() {
      if (Array.isArray(this.ForfeitedLeaves)) {
        const query = this.searchTextForfeited.toLowerCase();

        return this.ForfeitedLeaves
          .filter((row) => {
            return (
              row.id.toString().toLowerCase().includes(query) || // Search by ID
              this.LeaveTypeLabels[row.leaveType].toLowerCase().includes(query) ||
              this.formatDateTime(row.transDate).toLowerCase().includes(query) ||
              row.remarks.toLowerCase().includes(query)
            );
          })
          .sort((a, b) => b.id - a.id);
      } else {
        return [];
      }
    },

    LeaveTypeLabels() {
      return this.LeaveTypes.reduce((acc, { value, label }) => {
        acc[value] = label;
        return acc;
      }, {});
    },

  },

  methods: {
    clearSearchText() {
      this.searchTextDetails = '';
      this.searchTextForfeited = '';
      this.searchTextBalance = '';
    },

    toggleLeavesTable() {
      this.showLeaveHistory = !this.showLeaveHistory;
    },

    showPopup(refName) {
      this.$refs[refName].show();
    },

    async submitLeaveRequest() {
      if (!this.Days || !this.TimeFrom || !this.TimeTo || !this.DateFrom || !this.DateTo || !this.LeaveType) {
        this.$q.notify({
          color: 'negative',
          position: 'center',
          message: 'Input the Required Field',
          icon: 'report_problem',
          iconColor: 'white',
          timeout: 1000,
          progress: true,
        });
        return;
      }

      const leaveRequestData = {
        Days: this.Days,
        TimeFrom: this.TimeFrom,
        TimeTo: this.TimeTo,
        DateFrom: this.DateFrom,
        DateTo: this.DateTo,
        LeaveType: this.LeaveType.value,
        Reason: this.Reason,
      };

      this.$q.loading.show({
        spinner: QSpinnerTail,
        message: 'Submitting Leave Request Application',
        messageColor: 'white',
        backgroundColor: 'gray',
        spinnerColor: 'blue',
        customClass: 'custom-loading-style',
      });

      try 
      {
        await this.$store.dispatch('leaveModule/submitLeaveRequest', leaveRequestData);
        this.fetchLeaves();
        await delay(1350);
        this.$q.loading.hide();        
        this.$q.notify({
          color: 'positive',
          position: 'center',
          message: 'Success Leave Request, Wait For The Approval',
          icon: 'check',
          iconColor: 'white',
          timeout: 1000,
          progress: true,
        });

        this.Days = null;
        this.TimeFrom = null;
        this.TimeTo = null;
        this.DateFrom = null;
        this.DateTo = null;
        this.LeaveType = null;
        this.Reason = null;
      } catch (error) {
        this.$q.loading.hide();  
        this.Days = null;
        this.TimeFrom = null;
        this.TimeTo = null;
        this.DateFrom = null;
        this.DateTo = null;
        this.LeaveType = null;
        this.Reason = null;

        this.$q.notify({
          color: 'negative',
          position: 'center',
          message: 'Error Leave Request / Insufficient Balance, Check Your Balance',
          icon: 'report_problem',
          iconColor: 'white',
          timeout: 1000,
          progress: true,
        });
        
      }
    },

    async deleteLeave(LeaveID) {
      try {
        await this.$store.dispatch('leaveModule/deleteLeaves', LeaveID);
        this.fetchLeaves();
        this.$q.notify({
          color: 'positive',
          position: 'center',
          message: 'Success Deleting Leave Request',
          icon: 'check',
          iconColor: 'white',
          timeout: 1000,
          progress: true,
        });
      } catch (error) {
        console.error('Error Deleting Leave');
        this.$q.notify({
          color: 'negative',
          position: 'center',
          message: 'Error Deleting Leave Request',
          icon: 'report_problem',
          iconColor: 'white',
          timeout: 1000,
          progress: true,
        });
      }
    },

    editLeave(LeaveID) {
      this.editDialog = true;
      this.editLeaveID = LeaveID;
    },

    cancelEdit() {
      this.editDialog = false;
      this.LeaveIDToEdit = null;
      this.Days2 = null;
      this.TimeFrom2 = null;
      this.TimeTo2 = null;
      this.DateFrom2 = null;
      this.DateTo2 = null;
      this.LeaveType2 = null;
      this.Reason2 = null;
    },

    resetForm() {
      this.Days2 = null;
      this.DateFrom2 = null;
      this.DateTo2 = null;
      this.TimeFrom2 = null;
      this.TimeTo2 = null;
      this.LeaveType2 = null;
      this.Reason2 = null;
    },
    
    async updateLeave() {
      if (!this.Days2 || !this.TimeFrom2 || !this.TimeTo2 || !this.DateFrom2 || !this.DateTo2 || !this.LeaveType2 || !this.Reason2) {
        console.log('Input the required fields');
        this.$q.notify({
          color: 'negative',
          position: 'center',
          message: 'Please Input the Required Fields',
          icon: 'report_problem',
          iconColor: 'white',
          timeout: 1000,
          progress: true,
        });
        return;
      }

      const updatedLeave = {
        Days: this.Days2,
        TimeFrom: this.TimeFrom2,
        TimeTo: this.TimeTo2,
        DateFrom: this.DateFrom2,
        DateTo: this.DateTo2,
        LeaveType: this.LeaveType2.value,
        Reason: this.Reason2,
        editLeaveID: this.editLeaveID,
      };

      try {
        await this.$store.dispatch('leaveModule/updateLeaves', updatedLeave);
        this.fetchLeaves();
        this.$q.loading.hide();
        this.editDialog = false;
        this.Days2 = null;
        this.TimeFrom2 = null;
        this.TimeTo2 = null;
        this.DateFrom2 = null;
        this.DateTo2 = null;
        this.LeaveType2 = null;
        this.Reason2 = null;
        this.$q.notify({
          color: 'positive',
          position: 'center',
          message: 'Success Editing Leave Request',
          icon: 'check',
          iconColor: 'white',
          timeout: 1000,
          progress: true,
        });
      } catch (error) {
        console.error('Error Updating Leave');
        this.Days2 = null;
        this.TimeFrom2 = null;
        this.TimeTo2 = null;
        this.DateFrom2 = null;
        this.DateTo2 = null;
        this.LeaveType2 = null;
        this.Reason2 = null;
        
        this.$q.notify({
          color: 'negative',
          position: 'center',
          message: 'Error Editing / Updating Leave Request, Check the Balance of the Leave Type',
          icon: 'report_problem',
          iconColor: 'white',
          timeout: 1000,
          progress: true,
        });
      }
    },

    async fetchLeaves() {
      await delay(2000);
      try {
        await this.$store.dispatch('leaveModule/fetchLeaves');
        this.LeaveDetails = this.$store.state.leaveModule.leaveDetails;
        this.loadingCounter++;
        if (this.loadingCounter === 3) {
          this.loading = false;
        };
      } catch (error) {
        console.log('Failed getting Leave Details');
      } 
    },

    async fetchleaveBalance() {
      try {
        await this.$store.dispatch('leaveModule/fetchleaveBalances');
        this.leaveBalance = this.$store.state.leaveModule.balanceDetails;
        this.loadingCounter++;
        if (this.loadingCounter === 3) {
          this.loading = false;
        };
      } catch (error) {
        console.error('Failed Getting User Leave Balance');
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

    async fetchForfeitedLeaves() {  
      try {
        await this.$store.dispatch('leaveModule/fetchForfeitedLeaves');
        this.ForfeitedLeaves = this.$store.state.leaveModule.ForfeitedDetails;
        this.loadingCounter++;
        if (this.loadingCounter === 3) {
          this.loading = false;
        };
      } catch (error) {
        console.error('Failed to get the Forfeited Leaves');
      }
    },

    updateDays() {
      const updateDays = (DateFrom, DateTo, currentDays) => {
        const fromDate = new Date(DateFrom);
        const toDate = new Date(DateTo);

        if (!isNaN(fromDate.getTime()) && !isNaN(toDate.getTime())) {
          const millisecondsInDay = 24 * 60 * 60 * 1000;
          const daysDifference = (toDate - fromDate) / millisecondsInDay;

          if (daysDifference >= 0) {
            currentDays = Number.isInteger(daysDifference) ? daysDifference + 1 : daysDifference + (daysDifference % 1 === 0.5 ? -0.5 : 0.5);
          }
        }

        return currentDays;
      };

      if (this.DateFrom && this.DateTo) {
        if (this.updateDateToTriggered) {
          this.updateDateToTriggered = false;
          return;
        }

        this.Days = updateDays(this.DateFrom, this.DateTo, this.Days);
      }

      if (this.DateFrom2 && this.DateTo2) {
        if (this.updateDateToTriggered) {
          this.updateDateToTriggered = false;
          return;
        }

        this.Days2 = updateDays(this.DateFrom2, this.DateTo2, this.Days2);
      }
    },

    updateDateTo() {
      const updateDates = (DateFrom, days, DateTo) => {
        const fromDate = new Date(DateFrom);

        if (!isNaN(fromDate.getTime()) && days >= 0) {
          let totalMilliseconds;

          if (Number.isInteger(days)) {
            totalMilliseconds = (days - 1) * (24 * 60 * 60 * 1000);
          } else {
            totalMilliseconds = (days - 0.5) * (24 * 60 * 60 * 1000);
          }

          const toDate = new Date(fromDate.getTime() + totalMilliseconds);
          DateTo = this.formatDateTime(toDate);
        }

        return DateTo;
      };

      if (this.DateFrom && this.Days) {
        this.updateDateToTriggered = true;
        this.DateTo = updateDates(this.DateFrom, this.Days, this.DateTo);
      }

      if (this.DateFrom2 && this.Days2) {
        this.updateDateToTriggered = true;
        this.DateTo2 = updateDates(this.DateFrom2, this.Days2, this.DateTo2);
      }
    },

    formatDateTime(dateTimeString) {
      const options = {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      };
      const dateTime = new Date(dateTimeString);
      return dateTime.toLocaleDateString(undefined, options);
    },



  },

  watch: {
    DateFrom: 'updateDateTo',
    DateTo: 'updateDays',
    Days: 'updateDateTo',
    DateFrom2: 'updateDateTo',
    DateTo2: 'updateDays',
    Days2: 'updateDateTo',
  },

  created() {
    this.fetchLeaves();
    this.fetchleaveBalance();
    this.fetchAllLeaveBalances();
    this.fetchForfeitedLeaves();
  },
};
</script>



<style>



.roundedd {
  border-radius: 10px;
  margin-bottom: 50px;
  margin-top: 10px;
  height: 560px;
}


.roundedd1 {
  border-radius: 10px;
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