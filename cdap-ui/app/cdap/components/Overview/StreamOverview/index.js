/*
 * Copyright © 2017 Cask Data, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

import React, { Component, PropTypes } from 'react';
import OverviewHeader from 'components/Overview/OverviewHeader';
import OverviewMetaSection from 'components/Overview/OverviewMetaSection';
import StreamOverviewTab from 'components/Overview/StreamOverview/StreamOverviewTab';
import NamespaceStore from 'services/NamespaceStore';
import shortid from 'shortid';
import {objectQuery} from 'services/helpers';
import {MyMetadataApi} from 'api/metadata';
import {MyStreamApi} from 'api/stream';
import isNil from 'lodash/isNil';
import T from 'i18n-react';


export default class StreamOverview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      entity: this.props.entity,
      entityDetail: null,
      loading: false
    };
  }

  componentWillMount() {
    this.fetchStreamDetail();
  }

  componentWillReceiveProps(nextProps) {
    let {entity} = nextProps;
    if (!isNil(entity)) {
      this.setState({
        entity,
      }, this.fetchStreamDetail.bind(this));
    }
  }

  fetchStreamDetail() {
    this.setState({
      loading: true
    });

    let namespace = NamespaceStore.getState().selectedNamespace;

    if (objectQuery(this.props, 'entity', 'id')) {
      const streamParams = {
        namespace,
        streamId: this.props.entity.id
      };

      const metadataParams = {
        namespace,
        entityType: 'streams',
        entityId: this.props.entity.id,
        scope: 'SYSTEM'
      };

      MyMetadataApi.getProperties(metadataParams)
        .combineLatest(MyStreamApi.getPrograms(streamParams))
        .subscribe((res) => {
          let appId;
          let programs = res[1].map((program) => {
            program.uniqueId = shortid.generate();
            appId = program.application.applicationId;
            program.app = appId;
            program.name = program.id;
            return program;
          });

          let entityDetail = {
            programs,
            schema: res[0].schema,
            name: appId, // FIXME: Finalize on entity detail for fast action
            app: appId,
            id: this.props.entity.id,
            type: 'stream'
          };

          this.setState({
            entityDetail
          }, () => {
            setTimeout(() => {
              this.setState({
                loading: false
              });
            }, 1000);
          });
        });

    }
  }

  render() {
    if (this.state.loading) {
      return (
        <div className="fa fa-spinner fa-spin fa-3x"></div>
      );
    }

    let title = T.translate('commons.entity.stream.singular');
    let namespace = NamespaceStore.getState().selectedNamespace;
    return (
      <div className="app-overview">
        <OverviewHeader
          icon="icon-streams"
          title={title}
          linkTo={{
            pathname: `/ns/${namespace}/streams/${this.props.entity.id}`,
            state: {
              entityDetail: this.state.entityDetail
            }
          }}
          onClose={this.props.onClose}
        />
        <OverviewMetaSection entity={this.state.entity} />
        <StreamOverviewTab entity={this.state.entityDetail} />
      </div>
    );
  }
}

StreamOverview.propTypes = {
  toggleOverview: PropTypes.bool,
  entity: PropTypes.object,
  onClose: PropTypes.func
};
