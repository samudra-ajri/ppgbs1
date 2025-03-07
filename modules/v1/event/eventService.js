const eventConstant = require('../../../constants/eventConstant')
const { throwError } = require('../../../utils/errorUtils')
const eventElasticsearchRepository = require('./eventElasticsearchRepository')
const eventRepository = require('./eventRepository')

const eventService = {}

eventService.createEvent = async ({ session, payload }) => {
    const { name, passcode, startDate, endDate, location, description, grades, defaultPresenceStatus } = payload
    const data = {
        session,
        roomId: generateRoomId(),
        name,
        passcode,
        startDate,
        endDate,
        location,
        description,
        grades,
        defaultPresenceStatus,
    }
    
    const eventId = await eventRepository.insertEvent(data)
    const eventPresences = await eventRepository.getEventPresences(eventId)
    if (eventPresences.length) eventElasticsearchRepository.bulkEventPresence(eventPresences)
}

eventService.deleteEvent = async (session, id) => {
    const event = eventConstant.event.delete
    const foundEvent = await eventRepository.findById(session, id)
    if (!foundEvent || Number(foundEvent.createdBy) !== session.id) throwError(event.message.failed.notFound, 404)
    await eventRepository.deleteEvent(session.id, id)
    eventElasticsearchRepository.deleteEventPresence(id)
}

eventService.getEvents = async (session, filters, search, page, pageSize, order) => {
    const { data, total } = await eventRepository.findAll(session, filters, search, page, pageSize, order)
    return { data, total }
}

eventService.getTopEvents = async (session) => {
    const data = await eventRepository.findTop(session)
    return data
}

eventService.getEvent = async (session, id) => {
    const event = eventConstant.event.detail
    const foundEvent = await eventRepository.findById(session, id)
    if (!foundEvent) throwError(event.message.failed.notFound, 404)
    return foundEvent
}


const generateRoomId = () => {
    const roomId = Math.floor(Math.random() * 9000000000) + 1000000000
    return roomId.toString()
}

module.exports = eventService
