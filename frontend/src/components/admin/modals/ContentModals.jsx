import React from 'react';
import { Modal } from './Modal';
import { ContentForm, SeasonForm, EpisodeForm } from '../forms/ContentForms';
import { genres } from "./utils/utils";

export const ContentModals = ({ modals, forms, onModalClose, onFormChange, onSave }) => (
  <>
    {/* Content Add Modal */}
    <Modal
      show={modals.add}
      title="Neuen Inhalt hinzufügen"
      onClose={() => onModalClose('add')}
      onSave={onSave.content}
      saveText="Hinzufügen"
    >
      <ContentForm
        content={forms.newContent}
        onChange={(content) => onFormChange(prev => ({ ...prev, newContent: content }))}
        genres={genres}
      />
    </Modal>

    {/* Content Edit Modal */}
    <Modal
      show={modals.edit}
      title={`${forms.editingContent?.type === "movie" ? "Film" : "Serie"} bearbeiten`}
      onClose={() => onModalClose('edit')}
      onSave={onSave.editContent}
    >
      {forms.editingContent && (
        <ContentForm
          content={forms.editingContent}
          onChange={(content) => onFormChange(prev => ({ ...prev, editingContent: content }))}
          genres={genres}
        />
      )}
    </Modal>

    {/* Season Add Modal */}
    <Modal
      show={modals.addSeason}
      title="Neue Staffel hinzufügen"
      onClose={() => onModalClose('addSeason')}
      onSave={onSave.season}
      saveText="Hinzufügen"
    >
      <SeasonForm
        season={forms.newSeason}
        onChange={(season) => onFormChange(prev => ({ ...prev, newSeason: season }))}
      />
    </Modal>

    {/* Season Edit Modal */}
    <Modal
      show={modals.editSeason}
      title="Staffel bearbeiten"
      onClose={() => onModalClose('editSeason')}
      onSave={onSave.editSeason}
    >
      {forms.editingSeason && (
        <SeasonForm
          season={forms.editingSeason}
          onChange={(season) => onFormChange(prev => ({ ...prev, editingSeason: season }))}
        />
      )}
    </Modal>

    {/* Episode Add Modal */}
    <Modal
      show={modals.addEpisode}
      title="Neue Episode hinzufügen"
      onClose={() => onModalClose('addEpisode')}
      onSave={onSave.episode}
      saveText="Hinzufügen"
    >
      <EpisodeForm
        episode={forms.newEpisode}
        onChange={(episode) => onFormChange(prev => ({ ...prev, newEpisode: episode }))}
      />
    </Modal>

    {/* Episode Edit Modal */}
    <Modal
      show={modals.editEpisode}
      title="Episode bearbeiten"
      onClose={() => onModalClose('editEpisode')}
      onSave={onSave.editEpisode}
    >
      {forms.editingEpisode && (
        <EpisodeForm
          episode={forms.editingEpisode}
          onChange={(episode) => onFormChange(prev => ({ ...prev, editingEpisode: episode }))}
        />
      )}
    </Modal>
  </>
);
